import React from "react";
import { ComparisonDescription } from "../types";
import "./ChooseComparison.css";

interface ChooseComparisonProps {
  selected: ComparisonDescription;
  comparisons: ComparisonDescription[];
  onChange: (id: string) => void;
}

export type ChooseComparisonComponentType = React.FunctionComponent<
  ChooseComparisonProps
>;

const ChooseComparisonComponent: ChooseComparisonComponentType = ({
  selected,
  comparisons,
  onChange
}) => (
  <>
    <label htmlFor="chooseComparison" className="visually-hidden">
      Compare today with
    </label>
    <select
      id="chooseComparison"
      className="choose-comparison"
      value={selected.id}
      onChange={e => onChange(e.target.value)}
    >
      {comparisons.map(comparison => (
        <option key={comparison.id} value={comparison.id}>
          {comparison.label}
        </option>
      ))}
    </select>
  </>
);

export default ChooseComparisonComponent;
