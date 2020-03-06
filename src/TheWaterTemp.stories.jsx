import React from "react";
import { TheWaterTemp } from "./TheWaterTemp";

export default {
  title: "App",
  component: TheWaterTemp
};

export const app = () => (
  <TheWaterTemp
    actions={{
      loadUserPreferences: () => null,
      loadStations: () => null,
      loadLatestTemperature: stationId => null,
      loadLast24Hours: stationId => null
    }}
    Components={{}}
    userPreferences={{}}
    errorLoadingStations="Cannot load the stations: blah"
  />
);
