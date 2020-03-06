import React from "react";
import { ComparisonDescription, ComparisonIds } from "../types";
import "./ChooseComparison.css";

interface ChooseComparisonProps {
  selectedId: ComparisonIds;
  comparisons: ComparisonDescription[];
  onChange: (id: ComparisonIds) => void;
}

export type ChooseComparisonComponentType = React.FunctionComponent<
  ChooseComparisonProps
>;

const ChooseComparisonComponent: ChooseComparisonComponentType = ({
  selectedId,
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
      value={selectedId}
      onChange={e => onChange(e.target.value as ComparisonIds)}
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
