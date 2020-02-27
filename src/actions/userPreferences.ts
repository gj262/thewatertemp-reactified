import {
  TemperatureScale,
  ActionTypes,
  DispatchFunction,
  LocalStorage
} from "../types";
import { DEFAULTS } from "../defaults";

const USER_PREFS = "user_prefs";

export function loadUserPreferences(
  dispatch: DispatchFunction,
  localStorage: LocalStorage
) {
  const stored = localStorage.getItem(USER_PREFS);
  let scale = DEFAULTS.TEMPERATURE_SCALE;
  if (stored) {
    try {
      const storedObject = JSON.parse(stored);
      scale = storedObject.scale || DEFAULTS.TEMPERATURE_SCALE;
      if (!(scale in TemperatureScale)) {
        scale = DEFAULTS.TEMPERATURE_SCALE;
      }
    } catch (e) {
      scale = DEFAULTS.TEMPERATURE_SCALE;
    }
  }
  dispatch({
    type: ActionTypes.USER_PREFERENCES_LOADED,
    payload: {
      temperatureScale: scale
    }
  });
}
