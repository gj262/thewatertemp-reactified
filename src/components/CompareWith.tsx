import React from "react";
import { ComparisonList, ComparisonItem } from "../types";
import TemperatureRangeComponent from "./TemperatureRange";
import "./CompareWith.css";

interface CompareWithProps {
  list: ComparisonList;
  isLoading?: boolean;
  endDueTo?: string;
}

export type CompareWithComponentType = React.FunctionComponent<
  CompareWithProps
>;

const CompareWith: CompareWithComponentType = ({
  list,
  isLoading = false,
  endDueTo
}) => (
  <span className="compare-with">
    {list.map((item: ComparisonItem, idx) => (
      <React.Fragment key={item.regarding}>
        <h3>{item.regarding}</h3>
        <TemperatureRangeComponent
          range={item.range}
          isLoading={idx === list.length - 1 && !item.range}
        />
      </React.Fragment>
    ))}
    {endDueTo}
  </span>
);

export default CompareWith;
