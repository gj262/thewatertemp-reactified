import React from "react";
import { render } from "@testing-library/react";
import { TheWaterTemp } from "./TheWaterTemp";

const mockActions = {
  loadUserPreferences: jest.fn()
};

test("loads a users preferences", () => {
  render(<TheWaterTemp actions={mockActions} />);
  expect(mockActions.loadUserPreferences).toBeCalledTimes(1);
});
