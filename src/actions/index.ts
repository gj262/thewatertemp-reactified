import { UserPreferences, LocalStorage } from "../types";

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
    loadStations: forStations.loadStations.bind({}, dispatch)
  };
}

export interface ActionTypes {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
  loadStations: () => Promise<void>;
}
