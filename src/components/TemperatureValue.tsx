import React from "react";
import classNames from "classnames";
import { Temperature } from "../types";
import "./TemperatureValue.css";

interface TemperatureValueProps {
  temperature?: Temperature;
  caption?: React.ReactNode;
  large?: boolean;
  isLoading?: boolean;
  errorMsg?: string;
}

export type TemperatureValueComponentType = React.FunctionComponent<
  TemperatureValueProps
>;

const TemperatureValue: TemperatureValueComponentType = ({
  temperature,
  caption,
  large = false,
  isLoading = false,
  errorMsg = ""
}) => {
  return (
    <span className={classNames("temperature-value", { loading: isLoading })}>
      <span className={classNames({ large })}>
        {temperature ? temperature.value.toFixed(1) : "--.-"}°
      </span>
      {(caption || isLoading || errorMsg) && (
        <Caption caption={caption} isLoading={isLoading} errorMsg={errorMsg} />
      )}
    </span>
  );
};

export default TemperatureValue;

interface CaptionProps {
  caption?: React.ReactNode;
  isLoading?: boolean;
  errorMsg?: string;
}

const Caption: React.FunctionComponent<CaptionProps> = ({
  caption,
  isLoading = false,
  errorMsg = ""
}) => (
  <span className="caption">
    {caption && <span>{caption}</span>}
    {isLoading && <span>(loading...)</span>}
    {errorMsg && !isLoading && <span className="error">{errorMsg}</span>}
  </span>
);
