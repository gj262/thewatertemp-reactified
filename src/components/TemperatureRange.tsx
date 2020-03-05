import React from "react";
import { TemperatureRange } from "../types";
import TemperatureValue from "./TemperatureValue";
import "./TemperatureRange.css";

interface TemperatureRangeProps {
  range?: TemperatureRange;
  isLoading?: boolean;
}

export type TemperatureRangeComponentType = React.FunctionComponent<
  TemperatureRangeProps
>;

const TemperatureRangeComponent: TemperatureRangeComponentType = ({
  range,
  isLoading = false
}) => (
  <span className="temperature-range">
    <TemperatureValue
      temperature={range ? range.min : undefined}
      caption="Min"
      isLoading={isLoading}
    />
    <TemperatureValue
      temperature={range ? range.avg : undefined}
      caption="Avg"
      isLoading={isLoading}
    />
    <TemperatureValue
      temperature={range ? range.max : undefined}
      caption="Max"
      isLoading={isLoading}
    />
  </span>
);

export default TemperatureRangeComponent;
