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

export const aRange = () => (
  <div style={{ width: "320px" }}>
    <TemperatureRangeComponent range={range} />
  </div>
);
