import React from "react";
import { Temperature, TemperatureScale } from "../types";

import TemperatureValue from "./TemperatureValue";

const t = new Temperature(12.3456, TemperatureScale.FAHRENHEIT);

export default {
  title: "TemperatureValue",
  component: TemperatureValue
};

export const states = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <h3>Plain</h3>
    <TemperatureValue temperature={t} caption="Min" />
    <h3>Loading...</h3>
    <TemperatureValue isLoading caption="Min" />
    <h3>Missing</h3>
    <TemperatureValue caption="Min" />
    <h3>Error</h3>
    <TemperatureValue errorMsg="Cannot fetch the temperature" />
    <h3>Large</h3>
    <TemperatureValue temperature={t} caption="Recorded at 3:15pm." large />
    <h3>Loading with existing value</h3>
    <TemperatureValue temperature={t} caption="Recorded at 3:15pm." isLoading />
  </div>
);

class ToggleLoading extends React.Component<{}, { isLoading: boolean }> {
  toggleTimer: number = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.toggleTimer = window.setInterval(this.toggleLoading, 2000);
  }

  render() {
    return <TemperatureValue temperature={t} caption="Recorded at 3:15pm." isLoading={this.state.isLoading} />;
  }

  toggleLoading = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  componentWillUnmount() {
    window.clearInterval(this.toggleTimer);
  }
}

export const toggleLoading = () => <ToggleLoading />;
