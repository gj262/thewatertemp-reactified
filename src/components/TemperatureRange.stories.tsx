import React from "react";
import { Temperature, TemperatureScale, TemperatureRange } from "../types";

import TemperatureRangeComponent from "./TemperatureRange";

const range: TemperatureRange = {
  min: new Temperature(51.456, TemperatureScale.FAHRENHEIT),
  avg: new Temperature(51.89, TemperatureScale.FAHRENHEIT),
  max: new Temperature(53.478, TemperatureScale.FAHRENHEIT)
};

export default {
  title: "TemperatureRange",
  component: TemperatureRangeComponent
};

export const States = () => (
  <div
    style={{
      width: "var(--app-width)",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <h3>A Range</h3>
    <TemperatureRangeComponent range={range} />
    <h3>Without A Range</h3>
    <TemperatureRangeComponent />
    <h3>Loading...</h3>
    <TemperatureRangeComponent isLoading />
  </div>
);
