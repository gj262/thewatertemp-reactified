import { Action, ActionTypes, Station } from "../types";

interface _StationsState {
  isLoading: boolean;
  stations?: Station[];
  failure?: Error;
}

export type StationsState = _StationsState | null;

function stations(state: StationsState = null, action: Action): StationsState {
  switch (action.type) {
    case ActionTypes.LOADING_STATIONS:
      return state && state.stations ? state : { isLoading: true };
    case ActionTypes.STATIONS_LOADED:
      return { isLoading: false, stations: action.payload.stations };
    case ActionTypes.FAILED_TO_LOAD_STATIONS:
      return {
        isLoading: false,
        failure: action.error
      };
    default:
      return state;
  }
}

export function getStations(state: StationsState): Station[] | null {
  return state && state.stations ? state.stations : null;
}

export function isLoading(state: StationsState): boolean {
  return !!(state && state.isLoading);
}

export function loadFailed(state: StationsState): boolean {
  return !!(state && state.failure);
}

export function getFailureMessage(state: StationsState): string | null {
  return state && state.failure ? state.failure.message : null;
}

export default stations;
