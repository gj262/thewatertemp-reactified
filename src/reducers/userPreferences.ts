import { Action, UserPreferences, ActionTypes } from "../types";

function userPreferences(state: UserPreferences = null, action: Action) {
  switch (action.type) {
    case ActionTypes.USER_PREFERENCES_LOADED:
    case ActionTypes.USER_PREFERENCES_UPDATED:
      return { ...action.payload };
    default:
      return state;
  }
}

export function getUserPreferences(state: UserPreferences) {
  return state;
}

export default userPreferences;
