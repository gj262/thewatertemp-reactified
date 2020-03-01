import { Dispatch } from "redux";
import { UserPreferences, LocalStorage } from "../types";
import * as forUserPreferences from "./userPreferences";
import * as forStations from "./stations";
import * as forLatestTemperature from "./latestTemperature";

export default function makeActions(
  dispatch: Dispatch,
  localStorage: LocalStorage
) {
  return {
    loadUserPreferences: forUserPreferences.loadUserPreferences.bind(
      {},
      dispatch,
      localStorage
    ),
    updateUserPreferences: forUserPreferences.updateUserPreferences.bind(
      {},
      dispatch,
      localStorage
    ),
    loadStations: forStations.loadStations.bind({}, dispatch),
    loadLatestTemperature: forLatestTemperature.loadLatestTemperature.bind(
      {},
      dispatch
    )
  };
}

export interface ActionTypes {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
  loadStations: () => Promise<void>;
  loadLatestTemperature: (stationId: string) => Promise<void>;
}
