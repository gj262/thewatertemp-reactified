import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Router, navigate } from "@reach/router";
import "./TheWaterTemp.css";
import { RootState } from "./reducers";
import * as fromUserPreferences from "./reducers/userPreferences";
import * as fromStations from "./reducers/stations";
import * as fromLatestTemperature from "./reducers/latestTemperature";
import * as fromLast24Hours from "./reducers/last24Hours";
import makeActions, { ActionTypes } from "./actions";
import AllComponents, { ComponentTypes } from "./components";
import {
  TemperatureScale,
  UserPreferences,
  Station,
  Temperature,
  TemperatureRange
} from "./types";
import { DEFAULTS } from "./defaults";

export type TheWaterTempProps = PropsFromDependencyInjection &
  PropsFromStore &
  PropsFromRouting;

export interface TheWaterTempComponentTypes {
  Header: ComponentTypes["Header"];
  TemperatureScaleSelector: ComponentTypes["TemperatureScaleSelector"];
  SelectStation: ComponentTypes["SelectStation"];
  TemperatureValue: ComponentTypes["TemperatureValue"];
  TemperatureRange: ComponentTypes["TemperatureRange"];
}

export interface TheWaterTempActionTypes {
  loadUserPreferences: ActionTypes["loadUserPreferences"];
  updateUserPreferences: ActionTypes["updateUserPreferences"];
  loadStations: ActionTypes["loadStations"];
  loadLatestTemperature: ActionTypes["loadLatestTemperature"];
  loadLast24Hours: ActionTypes["loadLast24Hours"];
}

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    const {
      Components,
      userPreferences,
      loadingStations,
      stations,
      errorLoadingStations,
      station,
      invalidStationId,
      latestTemperature,
      errorLoadingLatestTemperature,
      last24Hours
    } = this.props;

    if (!userPreferences) {
      return null;
    }

    if (errorLoadingStations) {
      return (
        <div className="wrap">
          <div className="the-water-temperature">
            <span className="error">{errorLoadingStations}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="wrap">
        <div className="the-water-temperature">
          <Components.Header
            right={
              <Components.TemperatureScaleSelector
                scale={userPreferences.temperatureScale}
                onChange={this.onTemperatureScaleChange}
              />
            }
          />
          <Components.SelectStation
            onChange={this.onStationChange}
            loading={!!loadingStations}
            station={station}
            stations={stations || undefined}
          />
          <StationInfo invalidStationId={invalidStationId} station={station} />
          <h2 className="latest-reading">Latest reading:</h2>
          <Components.TemperatureValue
            temperature={latestTemperature || undefined}
            caption={
              <LatestTemperatureCaption
                temperature={latestTemperature || undefined}
                error={errorLoadingLatestTemperature || undefined}
              />
            }
            large
          />
          <h2>Over the last 24 hours:</h2>
          <Components.TemperatureRange range={last24Hours || undefined} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { actions, stationId, stations } = this.props;

    actions.loadUserPreferences();
    if (!stations) {
      actions.loadStations();
    }
    actions.loadLatestTemperature(stationId);
    actions.loadLast24Hours(stationId);
  }

  onTemperatureScaleChange = (scale: TemperatureScale) => {
    const { userPreferences, actions } = this.props;

    actions.updateUserPreferences({
      ...userPreferences,
      temperatureScale: scale
    });
  };

  onStationChange = (station: Station) => {
    const { navigateToStation } = this.props;

    navigateToStation(station);
  };

  componentDidUpdate(prevProps: TheWaterTempProps) {
    const { actions, stationId } = this.props;

    if (stationId !== prevProps.stationId) {
      actions.loadLatestTemperature(stationId);
      actions.loadLast24Hours(stationId);
    }
  }
}

interface StationInfoProps {
  station?: Station;
  invalidStationId?: string;
}

const StationInfo: React.FC<StationInfoProps> = ({
  invalidStationId,
  station
}) => {
  if (invalidStationId) {
    return (
      <span className="error">
        This is not a valid station ID: {invalidStationId}
      </span>
    );
  }
  return (
    <a
      href={station ? DEFAULTS.LINK_TO_STATION + station.id : "#"}
      title="Go to this stations home page"
    >
      Station: {station ? station.id : "loading..."}
    </a>
  );
};

interface LatestTemperatureCaptionProps {
  temperature?: Temperature;
  error?: string;
}

const LatestTemperatureCaption: React.FC<LatestTemperatureCaptionProps> = ({
  temperature,
  error
}) => {
  return (
    <>
      {temperature && <span>Recorded: {temperature?.timestamp}</span>}
      {error && <span className="error">{error}</span>}
      {!temperature && !error && <span>loading...</span>}
    </>
  );
};

// Routing (stationId) -> Store (lots...) -> Dependency Injection -> App

const WithRouting: React.FunctionComponent = props => (
  <Router>
    <InjectStoreData path="/" {...props} />
    <InjectStoreData path="/stations/:stationId" {...props} />
  </Router>
);

interface PropsFromRouting {
  path: string;
  stationId?: string;
}

const InjectComponentsAndActions: React.FunctionComponent<PropsFromStore &
  PropsFromRouting> = props => (
  <TheWaterTemp
    {...props}
    actions={makeActions(props.dispatch, window.localStorage)}
    navigateToStation={(station: Station) =>
      navigate(`/stations/${station.id}`)
    }
    Components={AllComponents}
  />
);

interface PropsFromDependencyInjection {
  actions: TheWaterTempActionTypes;
  navigateToStation: (station: Station) => void;
  Components: TheWaterTempComponentTypes;
}

const mapStateToProps = (state: RootState, ownProps: PropsFromRouting) => {
  const stations = fromStations.getStations(state.stations);

  const stationId = ownProps.stationId || DEFAULTS.STATION_ID;
  let stationProps;

  if (stations) {
    const station = stations.find(
      (station: Station) => station.id === stationId
    );
    if (station) {
      stationProps = { stationId, station };
    } else {
      stationProps = { stationId, invalidStationId: stationId };
    }
  } else {
    stationProps = { stationId };
  }

  const userPreferences = fromUserPreferences.getUserPreferences(
    state.userPreferences
  );

  let latestTemperature = fromLatestTemperature.getLatestTemperature(
    state.latestTemperature,
    stationId
  );

  let last24Hours = fromLast24Hours.getLast24Hours(
    state.last24Hours,
    stationId
  );

  if (userPreferences) {
    if (latestTemperature) {
      latestTemperature = latestTemperature.usingScale(
        userPreferences.temperatureScale
      );
    }
    if (last24Hours) {
      last24Hours = {
        min: last24Hours.min.usingScale(userPreferences.temperatureScale),
        max: last24Hours.max.usingScale(userPreferences.temperatureScale),
        avg: last24Hours.avg.usingScale(userPreferences.temperatureScale)
      };
    }
  }

  return {
    userPreferences,
    loadingStations: fromStations.isLoading(state.stations),
    stations: fromStations.getStations(state.stations),
    errorLoadingStations: fromStations.getFailureMessage(state.stations),
    ...stationProps,
    latestTemperature,
    errorLoadingLatestTemperature: fromLatestTemperature.getFailureMessage(
      state.latestTemperature,
      stationId
    ),
    last24Hours
  };
};

const InjectStoreData: React.FunctionComponent<PropsFromRouting> = connect(
  mapStateToProps
)(InjectComponentsAndActions);

interface PropsFromStore {
  dispatch: Dispatch;
  userPreferences: UserPreferences;
  loadingStations: boolean;
  stations: Station[] | null;
  errorLoadingStations: string | null;
  stationId: string;
  station?: Station;
  invalidStationId?: string;
  latestTemperature: Temperature | null;
  errorLoadingLatestTemperature: string | null;
  last24Hours: TemperatureRange | null;
}

export default WithRouting;
