import { combineReducers } from "redux";

import { UserPreferences } from "../types";
import userPreferences from "./userPreferences";
import stations, { StationsState } from "./stations";
import latestTemperature, { LatestTemperatureState } from "./latestTemperature";

export interface RootState {
  userPreferences: UserPreferences;
  stations: StationsState;
  latestTemperature: LatestTemperatureState;
}

export default combineReducers({
  userPreferences,
  stations,
  latestTemperature
});
