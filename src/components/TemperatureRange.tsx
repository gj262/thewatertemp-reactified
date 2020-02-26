import React from "react";
import { Temperature } from "../types";
import TemperatureValue from "./TemperatureValue";
import "./TemperatureRange.css";

interface TemperatureRangeProps {
  min: Temperature;
  avg: Temperature;
  max: Temperature;
}

const TemperatureRange: React.FunctionComponent<TemperatureRangeProps> = ({
  min,
  avg,
  max
}) => (
  <span className="temperature-range">
    <TemperatureValue temperature={min} caption="Min" />
    <TemperatureValue temperature={avg} caption="Avg" />
    <TemperatureValue temperature={max} caption="Max" />
  </span>
);

export default TemperatureRange;
