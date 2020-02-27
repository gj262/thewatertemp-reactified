import React from "react";
import "./TheWaterTemp.css";

interface Actions {
  loadUserPreferences: () => void;
}

interface TheWaterTempProps {
  actions: Actions;
}

export class TheWaterTemp extends React.Component<TheWaterTempProps> {
  render() {
    return <div className="the-water-temp"></div>;
  }

  componentDidMount() {
    this.props.actions.loadUserPreferences();
  }
}
