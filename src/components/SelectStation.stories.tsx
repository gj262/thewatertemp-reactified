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
    <SelectStation onChange={() => null} />
    <SelectStation loading onChange={() => null} />
    <SelectStation
      station={{ name: "Sand Island, Midway Islands", id: "22" }}
      onChange={() => null}
    />
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
