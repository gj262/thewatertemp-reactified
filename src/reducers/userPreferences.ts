import { Action, UserPreferences, ActionTypes } from "../types";

export type UserPreferencesState = UserPreferences;

function userPreferences(state: UserPreferencesState = null, action: Action) {
  switch (action.type) {
    case ActionTypes.USER_PREFERENCES_LOADED:
    case ActionTypes.USER_PREFERENCES_UPDATED:
      return { ...action.payload };
    default:
      return state;
  }
}

export function getUserPreferences(state: UserPreferencesState) {
  return state;
}

export default userPreferences;
