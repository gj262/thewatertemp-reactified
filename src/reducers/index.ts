import { combineReducers } from "redux";

import { UserPreferences } from "../types";
import userPreferences from "./userPreferences";

export interface RootState {
  userPreferences: UserPreferences;
}

export default combineReducers({
  userPreferences
});
