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
    <h3>Large</h3>
    <TemperatureValue temperature={t} caption="Recorded at 3:15pm." large />
    <h3>Loading...</h3>
    <TemperatureValue caption="loading..." />
    <h3>Error</h3>
    <TemperatureValue
      caption={
        <span className="loading-error">Cannot fetch the temperature</span>
      }
    />
  </div>
);
