import { combineReducers } from "redux";

import { UserPreferences } from "../types";
import userPreferences from "./userPreferences";
import stations, { StationsState } from "./stations";

export interface RootState {
  userPreferences: UserPreferences;
  stations: StationsState;
}

export default combineReducers({
  userPreferences,
  stations
});
