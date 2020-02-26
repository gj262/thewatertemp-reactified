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
    <TemperatureValue temperature={t} caption="Min" />
    <TemperatureValue temperature={t} caption="Recorded at 3:15pm." large />
  </div>
);
