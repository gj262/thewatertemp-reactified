import React from "react";
import { TemperatureScale } from "../types";

interface TemperatureScaleSelectorProps {
  scale: TemperatureScale;
  onChange: Function;
}

class TemperatureScaleSelector extends React.Component<
  TemperatureScaleSelectorProps
> {
  render() {
    const { scale } = this.props;

    return (
      <select name="temperatureScale" value={scale} onChange={this.onChange}>
        <option value={TemperatureScale.FAHRENHEIT}>°F</option>
        <option value={TemperatureScale.CELSIUS}>°C</option>
      </select>
    );
  }

  onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { onChange } = this.props;

    onChange(e.target.value);
  };
}

export default TemperatureScaleSelector;
