import React from "react";
import { render } from "@testing-library/react";

import Header from "./Header";

test("renders", () => {
  const { getByText } = render(<Header />);
  expect(getByText(/the water temperature/i)).toBeInTheDocument();
});

test("renders something right", () => {
  const { getByText } = render(<Header right={<span>RIGHT</span>} />);
  expect(getByText("RIGHT")).toBeInTheDocument();
});
