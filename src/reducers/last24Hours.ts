import { Action, ActionTypes, TemperatureRange } from "../types";

interface _PerStationLast24HoursState {
  isLoading: boolean;
  range?: TemperatureRange;
  failure?: Error;
}

export interface Last24HoursState {
  [stationId: string]: _PerStationLast24HoursState;
}

function last24Hours(
  state: Last24HoursState = {},
  action: Action
): Last24HoursState {
  switch (action.type) {
    case ActionTypes.LOADING_LAST_24_HOURS:
      const currentState = state[action.meta.stationId];
      return {
        ...state,
        [action.meta.stationId]:
          currentState && currentState.range
            ? currentState
            : { isLoading: true }
      };
    case ActionTypes.LAST_24_HOURS_LOADED:
      return {
        ...state,
        [action.meta.stationId]: {
          isLoading: false,
          range: {
            min: action.payload.min,
            max: action.payload.max,
            avg: action.payload.avg
          }
        }
      };
    case ActionTypes.FAILED_TO_LOAD_LAST_24_HOURS:
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

export function getLast24Hours(
  state: Last24HoursState,
  stationId: string
): TemperatureRange | null {
  if (stationId in state) {
    const thisStationState = state[stationId];
    if (thisStationState && thisStationState.range) {
      return thisStationState.range;
    }
  }
  return null;
}

export function isLoading(state: Last24HoursState, stationId: string): boolean {
  return !!(stationId in state && state[stationId].isLoading);
}

export function loadFailed(
  state: Last24HoursState,
  stationId: string
): boolean {
  return !!(stationId in state && state[stationId].failure);
}

export function getFailureMessage(
  state: Last24HoursState,
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

export default last24Hours;
