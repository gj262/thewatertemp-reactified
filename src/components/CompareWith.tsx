import React from "react";
import { ComparisonList, ComparisonItem } from "../types";
import TemperatureRangeComponent from "./TemperatureRange";
import "./CompareWith.css";

interface CompareWithProps {
  list: ComparisonList;
  isLoading?: boolean;
  endReason?: string;
}

export type CompareWithComponentType = React.FunctionComponent<CompareWithProps>;

const CompareWith: CompareWithComponentType = ({ list, isLoading = false, endReason }) => (
  <span className="compare-with">
    {list.map((item: ComparisonItem, idx) => (
      <React.Fragment key={item.regarding}>
        <h3>{item.regarding}</h3>
        <TemperatureRangeComponent range={item.range} isLoading={idx === list.length - 1 && !item.range} />
      </React.Fragment>
    ))}
    {endReason && (
      <>
        <h3>No more data found:</h3>
        {endReason}
      </>
    )}
  </span>
);

export default CompareWith;
