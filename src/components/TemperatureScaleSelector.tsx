import React from "react";
import { TemperatureScale } from "../types";

interface TemperatureScaleSelectorProps {
  scale: TemperatureScale;
  onChange: (scale: TemperatureScale) => void;
}

export type TemperatureScaleSelectorComponentType = React.ComponentType<
  TemperatureScaleSelectorProps
>;

class TemperatureScaleSelector extends React.Component<
  TemperatureScaleSelectorProps
> {
  render() {
    const { scale } = this.props;

    return (
      <>
        <label htmlFor="temperatureScale" className="visually-hidden">
          Choose a temperature scale
        </label>
        <select
          id="temperatureScale"
          name="temperature scale"
          value={scale}
          onChange={this.onChange}
        >
          <option value={TemperatureScale.FAHRENHEIT}>°F</option>
          <option value={TemperatureScale.CELSIUS}>°C</option>
        </select>
      </>
    );
  }

  onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { onChange } = this.props;

    onChange(e.target.value as TemperatureScale);
  };
}

export default TemperatureScaleSelector;
