import { UserPreferences, LocalStorage, Station } from "../types";

import * as forUserPreferences from "./userPreferences";
import * as forStations from "./stations";
import { Dispatch } from "redux";

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
    updateSelectedStation: (station: Station) => {},
    loadStations: forStations.loadStations.bind({}, dispatch)
  };
}

export interface ActionTypes {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
  updateSelectedStation: (station: Station) => void;
  loadStations: () => Promise<void>;
}
