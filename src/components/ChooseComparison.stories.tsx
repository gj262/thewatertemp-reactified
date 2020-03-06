import React from "react";
import ChooseComparison from "./ChooseComparison";

export default {
  title: "ChooseComparison",
  component: ChooseComparison
};

const comparisons = [
  { id: "last7days", label: "Last 7 days" },
  { id: "todayInPriorYears", label: "Today in prior years" }
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
    <ChooseComparison
      selected={comparisons[0]}
      comparisons={comparisons}
      onChange={() => null}
    />
    <h3>Other</h3>
    <ChooseComparison
      selected={comparisons[1]}
      comparisons={comparisons}
      onChange={() => null}
    />
  </div>
);
