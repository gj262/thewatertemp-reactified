import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Router, navigate } from "@reach/router";
import "./TheWaterTemp.css";
import { RootState } from "./reducers";
import * as fromUserPreferences from "./reducers/userPreferences";
import * as fromStations from "./reducers/stations";
import * as fromTemperatureData from "./reducers/temperatureData";
import makeActions, { ActionMethods } from "./actions";
import AllComponents, { ComponentTypes } from "./components";
import AllContainers, { ContainerTypes } from "./containers";
import { TemperatureScale, UserPreferences, Station, Temperature, TemperatureRange, TemperatureDataIds } from "./types";
import { DEFAULTS } from "./defaults";

export type TheWaterTempProps = PropsFromDependencyInjection & PropsFromStore & PropsFromRouting;

export interface TheWaterTempComponentTypes {
  Header: ComponentTypes["Header"];
  TemperatureScaleSelector: ComponentTypes["TemperatureScaleSelector"];
  SelectStation: ComponentTypes["SelectStation"];
  TemperatureValue: ComponentTypes["TemperatureValue"];
  TemperatureRange: ComponentTypes["TemperatureRange"];
  Footer: ComponentTypes["Footer"];
}

export interface TheWaterTempContainerTypes {
  Comparison: ContainerTypes["Comparison"];
}

export interface TheWaterTempActionMethods {
  loadUserPreferences: ActionMethods["loadUserPreferences"];
  updateUserPreferences: ActionMethods["updateUserPreferences"];
  loadStations: ActionMethods["loadStations"];
  loadLatestTemperature: ActionMethods["loadLatestTemperature"];
  loadLast24Hours: ActionMethods["loadLast24Hours"];
}

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    const {
      Components,
      Containers,
      userPreferences,
      loadingStations,
      stations,
      errorLoadingStations,
      station,
      invalidStationId,
      latestTemperature,
      errorLoadingLatestTemperature,
      last24Hours,
      stationId,
      comparisonId
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
          <h2>Compare to:</h2>
          <Containers.Comparison
            stationId={stationId}
            comparisonId={comparisonId}
            latestStationTime={
              latestTemperature && latestTemperature.timestamp ? new Date(latestTemperature.timestamp) : new Date()
            }
            onComparisonChange={this.onComparisonChange}
          />
          <Components.Footer />
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
    const { addRoutingState, comparisonId } = this.props;

    addRoutingState(station.id, comparisonId);
  };

  onComparisonChange = (comparisonId: TemperatureDataIds) => {
    const { addRoutingState, stationId } = this.props;

    addRoutingState(stationId, comparisonId);
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

const StationInfo: React.FC<StationInfoProps> = ({ invalidStationId, station }) => {
  if (invalidStationId) {
    return <span className="error">This is not a valid station ID: {invalidStationId}</span>;
  }
  return (
    <a href={station ? DEFAULTS.LINK_TO_STATION + station.id : "#"} title="Go to this stations home page">
      Station: {station ? station.id : "loading..."}
    </a>
  );
};

interface LatestTemperatureCaptionProps {
  temperature?: Temperature;
  error?: string;
}

const LatestTemperatureCaption: React.FC<LatestTemperatureCaptionProps> = ({ temperature, error }) => {
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
    <InjectStoreData path="/stations/:stationId/compare/:comparisonId" {...props} />
  </Router>
);

interface PropsFromRouting {
  path: string;
  stationId?: string;
  comparisonId?: TemperatureDataIds;
}

const InjectComponentsAndActions: React.FunctionComponent<PropsFromStore & PropsFromRouting> = props => {
  const addRoutingState = (stationId: string, comparisonId: TemperatureDataIds) =>
    navigate(`/stations/${stationId}/compare/${comparisonId}`);

  return (
    <TheWaterTemp
      {...props}
      actions={makeActions(props.dispatch, window.localStorage)}
      addRoutingState={addRoutingState}
      Components={AllComponents}
      Containers={AllContainers}
    />
  );
};

interface PropsFromDependencyInjection {
  actions: TheWaterTempActionMethods;
  addRoutingState: (stationId: string, comparisonId: TemperatureDataIds) => void;
  Components: TheWaterTempComponentTypes;
  Containers: TheWaterTempContainerTypes;
}

const mapStateToProps = (state: RootState, ownProps: PropsFromRouting) => {
  const stations = fromStations.getStations(state.stations);

  const stationId = ownProps.stationId || DEFAULTS.STATION_ID;
  let stationProps;

  if (stations) {
    const station = stations.find((station: Station) => station.id === stationId);
    if (station) {
      stationProps = { stationId, station };
    } else {
      stationProps = { stationId, invalidStationId: stationId };
    }
  } else {
    stationProps = { stationId };
  }

  const userPreferences = fromUserPreferences.getUserPreferences(state.userPreferences);

  let latestTemperature = fromTemperatureData.getTemperature(state.temperatureData, stationId, TemperatureDataIds.LATEST);

  let last24Hours = fromTemperatureData.getTemperatureRange(state.temperatureData, stationId, TemperatureDataIds.LAST_24_HOURS);

  if (userPreferences) {
    if (latestTemperature) {
      latestTemperature = latestTemperature.usingScale(userPreferences.temperatureScale);
    }
    if (last24Hours) {
      last24Hours = {
        min: last24Hours.min.usingScale(userPreferences.temperatureScale),
        max: last24Hours.max.usingScale(userPreferences.temperatureScale),
        avg: last24Hours.avg.usingScale(userPreferences.temperatureScale)
      };
    }
  }

  const comparisonId = ownProps.comparisonId || DEFAULTS.COMPARISON_ID;

  return {
    userPreferences,
    loadingStations: fromStations.isLoading(state.stations),
    stations: fromStations.getStations(state.stations),
    errorLoadingStations: fromStations.getFailureMessage(state.stations),
    ...stationProps,
    latestTemperature,
    errorLoadingLatestTemperature: fromTemperatureData.getFailureMessage(
      state.temperatureData,
      stationId,
      TemperatureDataIds.LATEST
    ),
    last24Hours,
    comparisonId
  };
};

const InjectStoreData: React.FunctionComponent<PropsFromRouting> = connect(mapStateToProps)(InjectComponentsAndActions);

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
  comparisonId: TemperatureDataIds;
}

export default WithRouting;
