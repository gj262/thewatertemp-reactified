import React from "react";
import { ComparisonDescription, TemperatureDataIds } from "../types";
import "./ChooseComparison.css";

interface ChooseComparisonProps {
  selectedId: TemperatureDataIds;
  comparisons: ComparisonDescription[];
  onChange: (id: TemperatureDataIds) => void;
}

export type ChooseComparisonComponentType = React.FunctionComponent<ChooseComparisonProps>;

const ChooseComparisonComponent: ChooseComparisonComponentType = ({ selectedId, comparisons, onChange }) => (
  <>
    <label htmlFor="chooseComparison" className="visually-hidden">
      Compare today with
    </label>
    <select
      id="chooseComparison"
      className="choose-comparison"
      value={selectedId}
      onChange={e => onChange(e.target.value as TemperatureDataIds)}
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
