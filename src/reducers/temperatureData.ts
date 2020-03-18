import { Action, ActionTypes, TemperatureDataIds, Temperature, TemperatureRange, ComparisonList } from "../types";

interface SingleTemperatureState {
  isLoading: boolean;
  data?: Temperature;
  failure?: Error;
}

interface TemperatureRangeState {
  isLoading: boolean;
  data?: TemperatureRange;
  failure?: Error;
}

interface ComparisonListState {
  isLoading: boolean;
  data?: ComparisonList;
  failure?: Error;
  endReason?: string;
}

type PossibleStates = SingleTemperatureState | TemperatureRangeState | ComparisonListState;

interface PerStationState {
  [dataId: string]: PossibleStates;
}

export interface TemperatureDataState {
  [stationId: string]: PerStationState;
}

export default function temperatureData(state: TemperatureDataState = {}, action: Action): TemperatureDataState {
  let stationState;
  let temperatureDataState;

  switch (action.type) {
    case ActionTypes.LOADING_TEMPERATURE_DATA:
      stationState = state[action.meta.stationId] || {};
      temperatureDataState =
        action.meta.dataId in stationState ? { ...stationState[action.meta.dataId], isLoading: true } : { isLoading: true };
      stationState = {
        ...stationState,
        [action.meta.dataId]: temperatureDataState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.TEMPERATURE_DATA_LOADED:
      stationState = state[action.meta.stationId] || {};
      stationState = {
        ...stationState,
        [action.meta.dataId]: { isLoading: false, data: action.payload.data } as PossibleStates
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.PARTIAL_COMPARISON_LIST_LOAD:
      stationState = state[action.meta.stationId] || {};
      temperatureDataState = stationState[action.meta.dataId] || {};

      let update = false;
      let data = (temperatureDataState.data as ComparisonList) || [];
      data = data.map(item => {
        if (item.regarding === action.payload.data.regarding) {
          update = true;
          return action.payload.data;
        }
        return item;
      });
      if (!update) {
        data = [...data, action.payload.data];
      }

      temperatureDataState = { data, isLoading: !!temperatureDataState.isLoading };
      stationState = {
        ...stationState,
        [action.meta.dataId]: temperatureDataState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.COMPLETED_COMPARISON_LIST_LOAD:
      stationState = state[action.meta.stationId] || {};
      temperatureDataState = stationState[action.meta.dataId] || {};
      temperatureDataState = {
        data: temperatureDataState.data as ComparisonList,
        endReason: action.payload.endReason,
        isLoading: false
      };
      stationState = {
        ...stationState,
        [action.meta.dataId]: temperatureDataState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA:
      stationState = state[action.meta.stationId] || {};
      temperatureDataState = stationState[action.meta.dataId] || {};
      temperatureDataState = { ...temperatureDataState, isLoading: false, failure: action.error };
      stationState = {
        ...stationState,
        [action.meta.dataId]: temperatureDataState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    default:
      return state;
  }
}

export function getTemperature(state: TemperatureDataState, stationId: string, dataId: TemperatureDataIds): Temperature | null {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return thisState && thisState.data ? (thisState.data as Temperature) : null;
}

export function getTemperatureRange(
  state: TemperatureDataState,
  stationId: string,
  dataId: TemperatureDataIds
): TemperatureRange | null {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return thisState && thisState.data ? (thisState.data as TemperatureRange) : null;
}

export function getComparisonList(
  state: TemperatureDataState,
  stationId: string,
  dataId: TemperatureDataIds
): ComparisonList | null {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return thisState && thisState.data ? (thisState.data as ComparisonList) : null;
}

export function isLoading(state: TemperatureDataState, stationId: string, dataId: TemperatureDataIds): boolean {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return !!(thisState && thisState.isLoading);
}

export function loadFailed(state: TemperatureDataState, stationId: string, dataId: TemperatureDataIds): boolean {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return !!(thisState && thisState.failure);
}

export function getFailureMessage(state: TemperatureDataState, stationId: string, dataId: TemperatureDataIds): string | null {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return thisState && thisState.failure ? thisState.failure.message : null;
}

export function getEndReason(state: TemperatureDataState, stationId: string, dataId: TemperatureDataIds): string | null {
  const thisState = _getTemperatureDataState(state, stationId, dataId);
  return thisState && "endReason" in thisState && thisState.endReason ? thisState.endReason : null;
}

function _getTemperatureDataState(
  state: TemperatureDataState,
  stationId: string,
  dataId: TemperatureDataIds
): SingleTemperatureState | TemperatureRangeState | ComparisonListState | null {
  if (stationId in state) {
    const thisStationState = state[stationId];
    if (thisStationState && dataId in thisStationState) {
      return thisStationState[dataId] || null;
    }
  }
  return null;
}
