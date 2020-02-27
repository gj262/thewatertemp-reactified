import React from "react";
import "./TheWaterTemp.css";
import { HeaderComponentType } from "./components/Header";
import { TemperatureScaleSelectorComponentType } from "./components/TemperatureScaleSelector";
import { TemperatureScale, UserPreferences } from "./types";

export interface Actions {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
}

export interface Components {
  Header: HeaderComponentType;
  TemperatureScaleSelector: TemperatureScaleSelectorComponentType;
}

interface TheWaterTempProps {
  actions: Actions;
  Components: Components;
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
