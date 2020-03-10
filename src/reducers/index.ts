import { combineReducers } from "redux";

import userPreferences, { UserPreferencesState } from "./userPreferences";
import stations, { StationsState } from "./stations";
import latestTemperature, { LatestTemperatureState } from "./latestTemperature";
import last24Hours, { Last24HoursState } from "./last24Hours";
import comparison, { ComparisonState } from "./comparison";

export interface RootState {
  userPreferences: UserPreferencesState;
  stations: StationsState;
  latestTemperature: LatestTemperatureState;
  last24Hours: Last24HoursState;
  comparison: ComparisonState;
}

export default combineReducers({
  userPreferences,
  stations,
  latestTemperature,
  last24Hours,
  comparison
});
