import React from "react";
import { Temperature, TemperatureScale } from "../types";

import TemperatureRange from "./TemperatureRange";

const min = new Temperature(51.456, TemperatureScale.FAHRENHEIT);
const avg = new Temperature(51.89, TemperatureScale.FAHRENHEIT);
const max = new Temperature(53.478, TemperatureScale.FAHRENHEIT);

export default {
  title: "TemperatureRange",
  component: TemperatureRange
};

export const aRange = () => (
  <div style={{ width: "320px" }}>
    <TemperatureRange min={min} avg={avg} max={max} />
  </div>
);
