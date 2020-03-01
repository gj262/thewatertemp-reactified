import { Action, ActionTypes, APIFailure, Temperature } from "../types";

interface _PerStationLatestTemperatureState {
  isLoading: boolean;
  temperature?: Temperature;
  failure?: APIFailure;
}

export interface LatestTemperatureState {
  [stationId: string]: _PerStationLatestTemperatureState;
}

function latestTemperature(
  state: LatestTemperatureState = {},
  action: Action
): LatestTemperatureState {
  switch (action.type) {
    case ActionTypes.LOADING_LATEST_TEMPERATURE:
      return { ...state, [action.meta.stationId]: { isLoading: true } };
    case ActionTypes.LATEST_TEMPERATURE_LOADED:
      return {
        ...state,
        [action.meta.stationId]: {
          isLoading: false,
          temperature: action.payload.temperature
        }
      };
    case ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE:
      return {
        ...state,
        [action.meta.stationId]: {
          isLoading: false,
          failure: { error: action.error, message: action.meta.message }
        }
      };
    default:
      return state;
  }
}

export function getLatestTemperature(
  state: LatestTemperatureState,
  stationId: string
): Temperature | null | undefined {
  return stationId in state && state[stationId].temperature
    ? state[stationId].temperature
    : null;
}

export function isLoading(
  state: LatestTemperatureState,
  stationId: string
): boolean {
  return !!(stationId in state && state[stationId].isLoading);
}

export function loadFailed(
  state: LatestTemperatureState,
  stationId: string
): boolean {
  return !!(stationId in state && state[stationId].failure);
}

export function getFailure(
  state: LatestTemperatureState,
  stationId: string
): { error: Error; message: string } | null | undefined {
  return stationId in state && state[stationId].failure
    ? state[stationId].failure
    : null;
}

export default latestTemperature;
