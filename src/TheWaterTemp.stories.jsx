import React from "react";
import { TheWaterTemp } from "./TheWaterTemp";

export default {
  title: "App",
  component: TheWaterTemp
};

export const app = () => (
  <TheWaterTemp
    actions={{ loadUserPreferences: () => null }}
    Components={{}}
    userPreferences={{}}
    loadingError="Cannot load the stations: blah"
  />
);
