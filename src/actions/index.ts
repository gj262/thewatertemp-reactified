import { UserPreferences, LocalStorage } from "../types";

import * as forUserPreferences from "./userPreferences";
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
    )
  };
}

export interface ActionTypes {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
}
