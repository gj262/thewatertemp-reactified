import React from "react";
import SelectStation from "./SelectStation";
import { Station } from "../types";
import allStations from "../data/stations-02-22-2020-cleaned";

export default {
  title: "SelectStation",
  component: SelectStation
};

export const states = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <h3>No Selection</h3>
    <SelectStation onChange={() => null} />
    <h3>Loading</h3>
    <SelectStation loading onChange={() => null} />
    <h3>A Selection</h3>
    <SelectStation
      station={{ name: "Sand Island, Midway Islands", id: "22" }}
      onChange={() => null}
    />
    <h3>Options Open</h3>
    <SelectStation
      station={{ name: "Sand Island, Midway Islands", id: "22" }}
      stations={[
        { name: "Sand Island, Midway Islands", id: "22" },
        { name: "Apra Harbor, Guam", id: "33" }
      ]}
      onChange={() => null}
      _open
    />
  </div>
);

class FullList extends React.Component<{}, { selected: Station }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selected: allStations[55]
    };
  }

  render() {
    return (
      <SelectStation
        station={this.state.selected}
        stations={allStations}
        onChange={this.onChange}
        _open
      />
    );
  }

  onChange = (stn: Station) => {
    this.setState({
      selected: stn
    });
  };
}

export const fullList = () => <FullList />;
