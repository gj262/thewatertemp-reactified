import React from "react";
import TemperatureScaleSelector from "./TemperatureScaleSelector";
import { TemperatureScale } from "../types";

export default {
  title: "TemperatureScaleSelector",
  component: TemperatureScaleSelector
};

export const degreesF = () => (
  <TemperatureScaleSelector
    scale={TemperatureScale.FAHRENHEIT}
    onChange={() => null}
  />
);
export const degreesC = () => (
  <TemperatureScaleSelector
    scale={TemperatureScale.CELSIUS}
    onChange={() => null}
  />
);
