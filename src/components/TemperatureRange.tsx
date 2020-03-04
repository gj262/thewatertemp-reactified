import React from "react";
import { TemperatureRange } from "../types";
import TemperatureValue from "./TemperatureValue";
import "./TemperatureRange.css";

interface TemperatureRangeProps {
  range?: TemperatureRange;
}

export type TemperatureRangeComponentType = React.FunctionComponent<
  TemperatureRangeProps
>;

const TemperatureRangeComponent: TemperatureRangeComponentType = ({
  range
}) => (
  <span className="temperature-range">
    <TemperatureValue
      temperature={range ? range.min : undefined}
      caption="Min"
    />
    <TemperatureValue
      temperature={range ? range.avg : undefined}
      caption="Avg"
    />
    <TemperatureValue
      temperature={range ? range.max : undefined}
      caption="Max"
    />
  </span>
);

export default TemperatureRangeComponent;
