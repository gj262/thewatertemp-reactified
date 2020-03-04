import { combineReducers } from "redux";

import { UserPreferences } from "../types";
import userPreferences from "./userPreferences";
import stations, { StationsState } from "./stations";
import latestTemperature, { LatestTemperatureState } from "./latestTemperature";
import last24Hours, { Last24HoursState } from "./last24Hours";

export interface RootState {
  userPreferences: UserPreferences;
  stations: StationsState;
  latestTemperature: LatestTemperatureState;
  last24Hours: Last24HoursState;
}

export default combineReducers({
  userPreferences,
  stations,
  latestTemperature,
  last24Hours
});
