import { combineReducers } from "redux";

import userPreferences, { UserPreferencesState } from "./userPreferences";
import stations, { StationsState } from "./stations";
import temperatureData, { TemperatureDataState } from "./temperatureData";

export interface RootState {
  userPreferences: UserPreferencesState;
  stations: StationsState;
  temperatureData: TemperatureDataState;
}

export default combineReducers({
  userPreferences,
  stations,
  temperatureData
});
