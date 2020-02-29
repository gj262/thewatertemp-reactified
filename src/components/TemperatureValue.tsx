import React from "react";
import classNames from "classnames";
import { Temperature } from "../types";
import "./TemperatureValue.css";

interface TemperatureValueProps {
  temperature?: Temperature;
  caption?: React.ReactNode;
  large?: boolean;
}

export type TemperatureValueComponentType = React.FunctionComponent<
  TemperatureValueProps
>;

const TemperatureValue: TemperatureValueComponentType = ({
  temperature,
  caption,
  large
}) => (
  <span className="temperature-value">
    <span className={classNames({ large })}>
      {temperature ? temperature.value.toFixed(1) : "--.-"}°
    </span>
    {caption && <span>{caption}</span>}
  </span>
);

export default TemperatureValue;
