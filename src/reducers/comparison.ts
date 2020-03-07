import { Action, ActionTypes, ComparisonIds, ComparisonList } from "../types";

interface _PerComparisonState {
  isLoading: boolean;
  data?: ComparisonList;
  failure?: Error;
  endReason?: string;
}

interface _PerStationState {
  [comparisonId: string]: _PerComparisonState;
}

export interface ComparisonState {
  [stationId: string]: _PerStationState;
}

function comparison(state: ComparisonState = {}, action: Action): ComparisonState {
  let stationState;
  let comparisonState;

  switch (action.type) {
    case ActionTypes.LOADING_COMPARISON:
      stationState = state[action.meta.stationId] || {};
      comparisonState = stationState[action.meta.comparisonId] || { isLoading: true };
      stationState = {
        ...stationState,
        [action.meta.comparisonId]: comparisonState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.COMPARISON_LOADED:
      stationState = state[action.meta.stationId] || {};
      stationState = {
        ...stationState,
        [action.meta.comparisonId]: { isLoading: false, data: action.payload.data }
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.PARTIAL_COMPARISON_LOAD:
      stationState = state[action.meta.stationId] || {};
      comparisonState = stationState[action.meta.comparisonId] || {};
      comparisonState = { data: [...(comparisonState.data || []), action.payload], isLoading: !!comparisonState.isLoading };
      stationState = {
        ...stationState,
        [action.meta.comparisonId]: comparisonState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.COMPLETED_COMPARISON_LOAD:
      stationState = state[action.meta.stationId] || {};
      comparisonState = stationState[action.meta.comparisonId] || {};
      comparisonState = { data: comparisonState.data, endReason: action.payload.endDueTo, isLoading: false };
      stationState = {
        ...stationState,
        [action.meta.comparisonId]: comparisonState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    case ActionTypes.FAILED_TO_LOAD_COMPARISON:
      stationState = state[action.meta.stationId] || {};
      comparisonState = stationState[action.meta.comparisonId] || {};
      comparisonState = { ...comparisonState, isLoading: false, failure: action.error };
      stationState = {
        ...stationState,
        [action.meta.comparisonId]: comparisonState
      };
      return {
        ...state,
        [action.meta.stationId]: stationState
      };

    default:
      return state;
  }
}

export function getComparison(state: ComparisonState, stationId: string, comparisonId: ComparisonIds): ComparisonList | null {
  const thisState = _getComparisonState(state, stationId, comparisonId);
  return thisState && thisState.data ? thisState.data : null;
}

function _getComparisonState(state: ComparisonState, stationId: string, comparisonId: ComparisonIds): _PerComparisonState | null {
  if (stationId in state) {
    const thisStationState = state[stationId];
    if (thisStationState && comparisonId in thisStationState) {
      return thisStationState[comparisonId];
    }
  }
  return null;
}

export function isLoading(state: ComparisonState, stationId: string, comparisonId: ComparisonIds): boolean {
  const thisState = _getComparisonState(state, stationId, comparisonId);
  return !!(thisState && thisState.isLoading);
}

export function loadFailed(state: ComparisonState, stationId: string, comparisonId: ComparisonIds): boolean {
  const thisState = _getComparisonState(state, stationId, comparisonId);
  return !!(thisState && thisState.failure);
}

export function getFailureMessage(state: ComparisonState, stationId: string, comparisonId: ComparisonIds): string | null {
  const thisState = _getComparisonState(state, stationId, comparisonId);
  return thisState && thisState.failure ? thisState.failure.message : null;
}

export function getEndReason(state: ComparisonState, stationId: string, comparisonId: ComparisonIds): string | null {
  const thisState = _getComparisonState(state, stationId, comparisonId);
  return thisState && thisState.endReason ? thisState.endReason : null;
}

export default comparison;
