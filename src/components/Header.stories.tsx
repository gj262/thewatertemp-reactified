import React from "react";
import Header from "./Header";
import TemperatureScaleSelector from "./TemperatureScaleSelector";
import { TemperatureScale } from "../types";

export default {
  title: "Header",
  component: Header
};

export const header = () => (
  <Header
    right={
      <TemperatureScaleSelector
        scale={TemperatureScale.FAHRENHEIT}
        onChange={() => null}
      />
    }
  />
);
