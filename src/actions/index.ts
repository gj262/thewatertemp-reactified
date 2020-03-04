import { Dispatch } from "redux";
import { UserPreferences, LocalStorage } from "../types";
import * as forUserPreferences from "./userPreferences";
import * as forStations from "./stations";
import * as forLatestTemperature from "./latestTemperature";
import * as forLast24Hours from "./last24Hours";

export default function makeActions(
  dispatch: Dispatch,
  localStorage: LocalStorage
): ActionTypes {
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
    ),
    loadLast24Hours: forLast24Hours.loadLast24Hours.bind({}, dispatch)
  };
}

export interface ActionTypes {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
  loadStations: () => Promise<void>;
  loadLatestTemperature: (stationId: string) => Promise<void>;
  loadLast24Hours: (stationId: string) => Promise<void>;
}
