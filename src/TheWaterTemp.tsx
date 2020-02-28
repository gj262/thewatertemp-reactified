import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./TheWaterTemp.css";
import { RootState } from "./reducers";
import * as fromUserPreferences from "./reducers/userPreferences";
import makeActions, { ActionTypes } from "./actions";
import AllComponents, { ComponentTypes } from "./components";
import { TemperatureScale, UserPreferences, Station } from "./types";

interface TheWaterTempProps {
  actions: ActionTypes;
  Components: ComponentTypes;
  userPreferences: UserPreferences;
  loadingStations?: boolean;
  station?: Station;
  stations?: Station[];
  loadingError?: string;
}

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    const {
      Components,
      userPreferences,
      loadingStations,
      station,
      stations,
      loadingError
    } = this.props;

    if (!userPreferences) {
      return null;
    }

    if (loadingError) {
      return (
        <div className="the-water-temp">
          <span className="loading-error">{loadingError}</span>
        </div>
      );
    }

    return (
      <div className="the-water-temp">
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
    const { actions } = this.props;

    actions.updateSelectedStation(station);
  };
}

interface TheWaterTempWrappedProps {
  userPreferences: UserPreferences;
  dispatch: Dispatch;
}

const TheWaterTempWrapped: React.FunctionComponent<TheWaterTempWrappedProps> = props => (
  <TheWaterTemp
    {...props}
    actions={makeActions(props.dispatch, window.localStorage)}
    Components={AllComponents}
  />
);

export const mapStateToProps = (state: RootState) => {
  return {
    userPreferences: fromUserPreferences.getUserPreferences(
      state.userPreferences
    )
  };
};

export default connect(mapStateToProps)(TheWaterTempWrapped);
