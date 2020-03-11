export enum TemperatureScale {
  FAHRENHEIT = "FAHRENHEIT",
  CELSIUS = "CELSIUS"
}

export interface Station {
  id: string;
  name: string;
  state?: string;
}

export class Temperature {
  value: number;
  scale: TemperatureScale;
  timestamp?: string;
  constructor(value: number, scale: TemperatureScale, timestamp?: string) {
    this.value = value;
    this.scale = scale;
    this.timestamp = timestamp;
  }

  usingScale(scale: TemperatureScale): Temperature {
    if (this.scale === scale) {
      return this;
    }
    if (this.scale === TemperatureScale.CELSIUS && scale === TemperatureScale.FAHRENHEIT) {
      return new Temperature(this.value * 1.8 + 32, TemperatureScale.FAHRENHEIT, this.timestamp);
    } else if (this.scale === TemperatureScale.FAHRENHEIT && scale === TemperatureScale.CELSIUS) {
      return new Temperature((this.value - 32) / 1.8, TemperatureScale.CELSIUS, this.timestamp);
    }

    throw new Error("Unhandled temp conversion");
  }
}

export interface TemperatureRange {
  min: Temperature;
  max: Temperature;
  avg: Temperature;
}

export interface ComparisonItem {
  regarding: string;
  range?: TemperatureRange;
}

export type ComparisonList = ComparisonItem[];

export interface ComparisonDescription {
  id: TemperatureDataIds;
  label: string;
}

interface _UserPreferences {
  temperatureScale: TemperatureScale;
}

export type UserPreferences = _UserPreferences | null;

export enum ActionTypes {
  USER_PREFERENCES_LOADED = "USER_PREFERENCES_LOADED",
  USER_PREFERENCES_UPDATED = "USER_PREFERENCES_UPDATED",
  LOADING_STATIONS = "LOADING_STATIONS",
  STATIONS_LOADED = "STATIONS_LOADED",
  FAILED_TO_LOAD_STATIONS = "FAILED_TO_LOAD_STATIONS",
  LOADING_TEMPERATURE_DATA = "LOADING_TEMPERATURE_DATA",
  TEMPERATURE_DATA_LOADED = "TEMPERATURE_DATA_LOADED",
  PARTIAL_COMPARISON_LIST_LOAD = "PARTIAL_COMPARISON_LIST_LOAD",
  COMPLETED_COMPARISON_LIST_LOAD = "COMPLETED_COMPARISON_LIST_LOAD",
  FAILED_TO_LOAD_TEMPERATURE_DATA = "FAILED_TO_LOAD_TEMPERATURE_DATA"
}

export interface UserPreferencesLoadedAction {
  type: ActionTypes.USER_PREFERENCES_LOADED;
  payload: _UserPreferences;
}

export interface UserPreferencesUpdatedAction {
  type: ActionTypes.USER_PREFERENCES_UPDATED;
  payload: _UserPreferences;
}

export interface LoadingStationsAction {
  type: ActionTypes.LOADING_STATIONS;
}

export interface StationsLoadedAction {
  type: ActionTypes.STATIONS_LOADED;
  payload: { stations: Station[] };
}

export interface FailedToLoadStationsAction {
  type: ActionTypes.FAILED_TO_LOAD_STATIONS;
  error: Error;
}

export enum TemperatureDataIds {
  LATEST = "latest",
  LAST_24_HOURS = "last24Hours",
  LAST_SEVEN_DAYS = "lastSevenDays",
  TODAY_IN_PRIOR_YEARS = "todayInPriorYears"
}

export interface TemperatureDataMeta {
  stationId: string;
  dataId: string;
}

export interface LoadingTemperatureDataAction {
  type: ActionTypes.LOADING_TEMPERATURE_DATA;
  meta: TemperatureDataMeta;
}

export interface SingleTemperatureLoadedAction {
  type: ActionTypes.TEMPERATURE_DATA_LOADED;
  payload: {
    data: Temperature;
  };
  meta: TemperatureDataMeta;
}

export interface TemperatureRangeLoadedAction {
  type: ActionTypes.TEMPERATURE_DATA_LOADED;
  payload: {
    data: TemperatureRange;
  };
  meta: TemperatureDataMeta;
}

export interface ComparisonListLoadedAction {
  type: ActionTypes.TEMPERATURE_DATA_LOADED;
  payload: {
    data: ComparisonList;
  };
  meta: TemperatureDataMeta;
}

export interface PartialComparisonListLoadAction {
  type: ActionTypes.PARTIAL_COMPARISON_LIST_LOAD;
  payload: { data: ComparisonItem };
  meta: TemperatureDataMeta;
}

export interface CompletedComparisonListLoadAction {
  type: ActionTypes.COMPLETED_COMPARISON_LIST_LOAD;
  payload: { endReason: string };
  meta: TemperatureDataMeta;
}

export interface FailedToLoadTemperatureDataAction {
  type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA;
  error: Error;
  meta: TemperatureDataMeta;
}

export type Action =
  | UserPreferencesLoadedAction
  | UserPreferencesUpdatedAction
  | LoadingStationsAction
  | StationsLoadedAction
  | FailedToLoadStationsAction
  | LoadingTemperatureDataAction
  | SingleTemperatureLoadedAction
  | TemperatureRangeLoadedAction
  | ComparisonListLoadedAction
  | PartialComparisonListLoadAction
  | CompletedComparisonListLoadAction
  | FailedToLoadTemperatureDataAction;

export interface LocalStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
}
