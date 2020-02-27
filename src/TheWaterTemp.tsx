import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./TheWaterTemp.css";
import { RootState } from "./reducers";
import * as fromUserPreferences from "./reducers/userPreferences";
import makeActions, { ActionTypes } from "./actions";
import AllComponents, { ComponentTypes } from "./components";
import { TemperatureScale, UserPreferences } from "./types";

interface TheWaterTempProps {
  actions: ActionTypes;
  Components: ComponentTypes;
  userPreferences: UserPreferences;
}

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    const { Components, userPreferences } = this.props;

    if (!userPreferences) {
      return null;
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
      </div>
    );
  }

  componentDidMount() {
    this.props.actions.loadUserPreferences();
  }

  onTemperatureScaleChange = (scale: TemperatureScale) => {
    const { userPreferences, actions } = this.props;

    actions.updateUserPreferences({
      ...userPreferences,
      temperatureScale: scale
    });
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
