import { Action, ActionTypes, Temperature } from "../types";

interface _PerStationLatestTemperatureState {
  isLoading: boolean;
  temperature?: Temperature;
  failure?: Error;
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
          failure: action.error
        }
      };
    default:
      return state;
  }
}

export function getLatestTemperature(
  state: LatestTemperatureState,
  stationId: string
): Temperature | null {
  if (stationId in state) {
    const thisStationState = state[stationId];
    if (thisStationState && thisStationState.temperature) {
      return thisStationState.temperature;
    }
  }
  return null;
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

export function getFailureMessage(
  state: LatestTemperatureState,
  stationId: string
): string | null {
  if (stationId in state) {
    const thisStationState = state[stationId];
    if (thisStationState && thisStationState.failure) {
      return thisStationState.failure.message;
    }
  }
  return null;
}

export default latestTemperature;
