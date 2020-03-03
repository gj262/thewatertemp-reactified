import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SelectStation from "./SelectStation";

test("renders", () => {
  render(<SelectStation onChange={() => null} />);
});

test("shows loading", () => {
  const { queryByPlaceholderText } = render(
    <SelectStation loading onChange={() => null} />
  );
  expect(queryByPlaceholderText(/loading.../i)).not.toBeNull();
});

test("does not show loading", () => {
  const { queryByPlaceholderText } = render(
    <SelectStation onChange={() => null} />
  );
  expect(queryByPlaceholderText(/loading.../i)).toBeNull();
});

test("shows a station name", () => {
  const { queryByDisplayValue, queryByText } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      onChange={() => null}
    />
  );
  expect(queryByDisplayValue(/Somewhere/i)).not.toBeNull();
  expect(queryByText(/Elsewhere/i)).toBeNull();
});

test("changing the station changes the display", () => {
  const { queryByDisplayValue, queryByText, rerender } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      onChange={() => null}
    />
  );
  rerender(
    <SelectStation
      station={{ name: "Elsewhere", id: "33" }}
      onChange={() => null}
    />
  );
  expect(queryByDisplayValue(/Elsewhere/i)).not.toBeNull();
  expect(queryByText(/Somewhere/i)).toBeNull();
});

test("focus selects the station name text", () => {
  const { getByDisplayValue } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      onChange={() => null}
    />
  );
  const element = getByDisplayValue(/Somewhere/i) as HTMLInputElement;
  expect(element.selectionStart).toEqual(0);
  expect(element.selectionEnd).toEqual(0);
  element.focus();
  expect(element.selectionStart).toEqual(0);
  expect(element.selectionEnd).toEqual(9);
});

test("click opens a menu of stations", () => {
  const { getByDisplayValue, queryByText } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      stations={[
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]}
      onChange={() => null}
    />
  );
  expect(queryByText(/Elsewhere/i)).toBeNull(); // hidden by default
  userEvent.click(getByDisplayValue(/Somewhere/i));
  expect(queryByText(/Elsewhere/i)).not.toBeNull();
});

test("click outside closes the menu", () => {
  const { getByDisplayValue, getByText, queryByText } = render(
    <div>
      <SelectStation
        station={{ name: "Somewhere", id: "22" }}
        stations={[
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]}
        onChange={() => null}
      />
      <div>OUTSIDE</div>
    </div>
  );
  userEvent.click(getByDisplayValue(/Somewhere/i));
  userEvent.click(getByText("OUTSIDE"));
  expect(queryByText(/Elsewhere/i)).toBeNull();
});

test("click outside reverts any input edits", async () => {
  const { getByDisplayValue, getByText, queryByDisplayValue } = render(
    <div>
      <SelectStation
        station={{ name: "Somewhere", id: "22" }}
        stations={[
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]}
        onChange={() => null}
      />
      <div>OUTSIDE</div>
    </div>
  );
  const stationInput = getByDisplayValue(/Somewhere/i);
  userEvent.click(stationInput);
  await userEvent.type(stationInput, "changed");
  expect(queryByDisplayValue(/changed/i)).not.toBeNull();
  userEvent.click(getByText("OUTSIDE"));
  expect(queryByDisplayValue(/changed/i)).toBeNull();
  expect(queryByDisplayValue(/Somewhere/i)).not.toBeNull();
});

test("clicking a menu item fires a change", () => {
  const change = jest.fn();
  const { getByDisplayValue, getByText } = render(
    <div>
      <SelectStation
        station={{ name: "Somewhere", id: "22" }}
        stations={[
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]}
        onChange={change}
      />
    </div>
  );
  userEvent.click(getByDisplayValue(/Somewhere/i));
  userEvent.click(getByText("Elsewhere"));
  expect(change.mock.calls.length).toEqual(1);
  expect(change.mock.calls[0][0]).toEqual({ name: "Elsewhere", id: "33" });
});

test("clicking a menu item that matches the display does not fire a change", () => {
  const change = jest.fn();
  const { getByDisplayValue, getByText } = render(
    <div>
      <SelectStation
        station={{ name: "Somewhere", id: "22" }}
        stations={[
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]}
        onChange={change}
      />
    </div>
  );
  userEvent.click(getByDisplayValue(/Somewhere/i));
  userEvent.click(getByText("Somewhere"));
  expect(change.mock.calls.length).toEqual(0);
});

test("clicking a menu item updates the displayed value", () => {
  const { getByDisplayValue, getByText, queryByDisplayValue } = render(
    <div>
      <SelectStation
        station={{ name: "Somewhere", id: "22" }}
        stations={[
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]}
        onChange={() => null}
      />
    </div>
  );
  userEvent.click(getByDisplayValue(/Somewhere/i));
  userEvent.click(getByText("Elsewhere"));
  expect(queryByDisplayValue(/Somewhere/i)).toBeNull();
  expect(queryByDisplayValue(/Elsewhere/i)).not.toBeNull();
});

test("clicking a menu item closes the menu", () => {
  const { getByDisplayValue, getByText, queryByText } = render(
    <div>
      <SelectStation
        station={{ name: "Somewhere", id: "22" }}
        stations={[
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]}
        onChange={() => null}
      />
    </div>
  );
  userEvent.click(getByDisplayValue(/Somewhere/i));
  userEvent.click(getByText("Elsewhere"));
  expect(queryByText(/Somewhere/i)).toBeNull();
  expect(queryByText(/Elsewhere/i)).toBeNull();
});

test("ESC closes the menu", async () => {
  const { getByDisplayValue, queryByText } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      stations={[
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]}
      onChange={() => null}
    />
  );
  userEvent.click(getByDisplayValue(/Somewhere/i));
  fireEvent.keyUp(window.document, { key: "Escape", keyCode: 27 });
  expect(queryByText(/Elsewhere/i)).toBeNull();
});

test("ESC reverts any input edits", async () => {
  const { getByDisplayValue, queryByDisplayValue } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      stations={[
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]}
      onChange={() => null}
    />
  );
  const stationInput = getByDisplayValue(/Somewhere/i);
  userEvent.click(stationInput);
  await userEvent.type(stationInput, "changed");
  fireEvent.keyUp(window.document, { key: "Escape", keyCode: 27 });
  expect(queryByDisplayValue(/changed/i)).toBeNull();
  expect(queryByDisplayValue(/Somewhere/i)).not.toBeNull();
});

test("input value filters the menu", async () => {
  const { getByDisplayValue, queryByText } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      stations={[
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]}
      onChange={() => null}
    />
  );
  const stationInput = getByDisplayValue(/Somewhere/i);
  userEvent.click(stationInput);
  expect(queryByText(/Somewhere/i)).not.toBeNull();
  expect(queryByText(/Elsewhere/i)).not.toBeNull();
  await userEvent.type(stationInput, "LS");
  expect(queryByText(/Somewhere/i)).toBeNull();
  expect(queryByText(/Elsewhere/i)).not.toBeNull();
});

test("the input value is highlighted in the menu", () => {
  const { getByDisplayValue, getByText } = render(
    <SelectStation
      station={{ name: "Somewhere", id: "22" }}
      stations={[
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]}
      onChange={() => null}
    />
  );
  const stationInput = getByDisplayValue(/Somewhere/i);
  userEvent.click(stationInput);
  expect(getByText(/Somewhere/i)).toHaveClass("selected");
  expect(getByText(/Elsewhere/i)).not.toHaveClass("selected");
});
