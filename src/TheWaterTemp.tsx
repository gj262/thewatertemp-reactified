import React from "react";
import { connect } from "react-redux";
import { Router, navigate } from "@reach/router";
import "./TheWaterTemp.css";
import { RootState } from "./reducers";
import * as fromUserPreferences from "./reducers/userPreferences";
import * as fromStations from "./reducers/stations";
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

export interface TheWaterTempProps {
  actions: ActionTypes;
  Components: ComponentTypes;
  userPreferences: UserPreferences;
  navigateToStation: (station: Station) => void;
  loadingStations?: boolean;
  station?: Station;
  stations?: Station[];
  loadingError?: string;
  invalidStationId?: string;
  latestTemperature?: Temperature;
}

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    const {
      Components,
      userPreferences,
      loadingStations,
      station,
      stations,
      loadingError,
      invalidStationId,
      latestTemperature
    } = this.props;

    if (!userPreferences) {
      return null;
    }

    if (loadingError) {
      return (
        <div className="the-water-temperature">
          <span className="loading-error">{loadingError}</span>
        </div>
      );
    }

    return (
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
          stations={stations}
        />
        <StationInfo invalidStationId={invalidStationId} station={station} />
        <h2>Latest reading:</h2>
        <Components.TemperatureValue temperature={latestTemperature} large />
      </div>
    );
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.loadUserPreferences();
    actions.loadStations();
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

interface InjectComponentsAndActionsProps extends TheWaterTempProps {
  dispatch: Dispatch;
}

const InjectComponentsAndActions: React.FunctionComponent<InjectComponentsAndActionsProps> = props => (
  <TheWaterTemp
    {...props}
    actions={makeActions(props.dispatch, window.localStorage)}
    Components={AllComponents}
  />
);

const WithRouting: React.FunctionComponent<any> = props => (
  <Router>
    <HandleRouting path="/" {...props} />
    <HandleRouting path="/stations/:stationId" {...props} />
  </Router>
);

interface HandleRoutingProps extends InjectComponentsAndActionsProps {
  stationId?: string;
}

const HandleRouting: React.FunctionComponent<HandleRoutingProps> = props => {
  let stationProps = {};
  const stationId = props.stationId || DEFAULTS.STATION_ID;
  if (props.stations) {
    const station = props.stations.find(
      (station: Station) => station.id === stationId
    );
    if (station) {
      stationProps = { station };
    } else {
      stationProps = { invalidStationId: stationId };
    }
  }

  return (
    <div className="wrap">
      <InjectComponentsAndActions
        {...props}
        {...stationProps}
        navigateToStation={(station: Station) =>
          navigate(`/stations/${station.id}`)
        }
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    userPreferences: fromUserPreferences.getUserPreferences(
      state.userPreferences
    ),
    loadingStations: fromStations.isLoading(state.stations),
    stations: fromStations.getStations(state.stations),
    loadingError: fromStations.loadFailed(state.stations)
      ? fromStations.getFailure(state.stations)?.message
      : null
  };
};

const InjectStoreData = connect(mapStateToProps)(WithRouting);

export default InjectStoreData;
