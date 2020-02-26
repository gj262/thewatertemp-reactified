import React from "react";
import classNames from "classnames";
import { Temperature } from "../types";
import "./TemperatureValue.css";

interface TemperatureValueProps {
  temperature: Temperature;
  caption?: string;
  large?: boolean;
}

const TemperatureValue: React.FunctionComponent<TemperatureValueProps> = ({
  temperature,
  caption,
  large
}) => (
  <span className="temperature-value">
    <span className={classNames({ large })}>
      {temperature.value.toFixed(1)}°
    </span>
    {caption && <span>{caption}</span>}
  </span>
);

export default TemperatureValue;
