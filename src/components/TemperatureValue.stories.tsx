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
  </div>
);
