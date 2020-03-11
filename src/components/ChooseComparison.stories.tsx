import React from "react";
import { TemperatureDataIds } from "../types";

import ChooseComparison from "./ChooseComparison";

export default {
  title: "ChooseComparison",
  component: ChooseComparison
};

const comparisons = [
  { id: TemperatureDataIds.LAST_SEVEN_DAYS, label: "Last 7 days" },
  { id: TemperatureDataIds.TODAY_IN_PRIOR_YEARS, label: "Today in prior years" }
];

export const both = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      width: "var(--app-width)"
    }}
  >
    <h3>One</h3>
    <ChooseComparison selectedId={comparisons[0].id} comparisons={comparisons} onChange={() => null} />
    <h3>Other</h3>
    <ChooseComparison selectedId={comparisons[1].id} comparisons={comparisons} onChange={() => null} />
  </div>
);
