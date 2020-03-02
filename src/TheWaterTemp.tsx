import React from "react";
import { connect } from "react-redux";
import { Router, navigate } from "@reach/router";
import "./TheWaterTemp.css";
import { RootState } from "./reducers";
import * as fromUserPreferences from "./reducers/userPreferences";
import * as fromStations from "./reducers/stations";
import * as fromLatestTemperature from "./reducers/latestTemperature";
import makeActions, { ActionTypes } from "./actions";
import AllComponents, { ComponentTypes } from "./components";
import {
  TemperatureScale,
  UserPreferences,
  Station,
  Temperature
} from "./types";
import { DEFAULTS } from "./defaults";
import { Dispatch } from "redux";

export type TheWaterTempProps = PropsFromDependencyInjection &
  PropsFromStore &
  PropsFromRouting;

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    const {
      Components,
      userPreferences,
      loadingStations,
      stations,
      loadingError,
      station,
      invalidStationId,
      latestTemperature
    } = this.props;

    if (!userPreferences) {
      return null;
    }

    if (loadingError) {
      return (
        <div className="wrap">
          <div className="the-water-temperature">
            <span className="loading-error">{loadingError}</span>
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
          <h2>Latest reading:</h2>
          <Components.TemperatureValue
            temperature={latestTemperature || undefined}
            large
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { actions, stationId } = this.props;

    actions.loadUserPreferences();
    actions.loadStations();
    actions.loadLatestTemperature(stationId);
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
      <span className="loading-error">
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
  actions: ActionTypes;
  navigateToStation: (station: Station) => void;
  Components: ComponentTypes;
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

  return {
    userPreferences: fromUserPreferences.getUserPreferences(
      state.userPreferences
    ),
    loadingStations: fromStations.isLoading(state.stations),
    stations: fromStations.getStations(state.stations),
    loadingError: fromStations.getFailureMessage(state.stations),
    ...stationProps,
    latestTemperature: fromLatestTemperature.getLatestTemperature(
      state.latestTemperature,
      stationId
    )
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
  loadingError: string | null;
  stationId: string;
  station?: Station;
  invalidStationId?: string;
  latestTemperature: Temperature | null;
}

export default WithRouting;
