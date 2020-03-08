import React from "react";
import { Temperature, TemperatureScale } from "../types";

import CompareWith from "./CompareWith";

const list = [
  {
    regarding: "2019",
    range: {
      min: new Temperature(51.456, TemperatureScale.FAHRENHEIT),
      avg: new Temperature(51.89, TemperatureScale.FAHRENHEIT),
      max: new Temperature(53.478, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "2018",
    range: {
      min: new Temperature(52, TemperatureScale.FAHRENHEIT),
      avg: new Temperature(53, TemperatureScale.FAHRENHEIT),
      max: new Temperature(54, TemperatureScale.FAHRENHEIT)
    }
  }
];

export default {
  title: "CompareWith",
  component: CompareWith
};

const Wrap: React.FC = props => (
  <div
    style={{
      width: "var(--app-width)",
      display: "flex",
      flexDirection: "column"
    }}
  >
    {props.children}
  </div>
);

export const Regular = () => (
  <Wrap>
    <CompareWith list={list} />
  </Wrap>
);

const loadingList = [...list, { regarding: "2017" }];

export const Loading = () => (
  <Wrap>
    <CompareWith isLoading list={loadingList} />
  </Wrap>
);

const gaps = [
  list[0],
  { regarding: "2018" },
  { regarding: "2017", range: list[1].range },
  { regarding: "2016", range: list[0].range }
];

export const WithGap = () => (
  <Wrap>
    <CompareWith list={gaps} />
  </Wrap>
);

export const ExplainDoneness = () => (
  <Wrap>
    <CompareWith list={gaps} endReason="Years 2015, 2014, 2013 returned no data" />
  </Wrap>
);
