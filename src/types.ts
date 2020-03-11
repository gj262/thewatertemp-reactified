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
  id: ComparisonIds;
  label: string;
}

export enum ComparisonIds {
  LAST_SEVEN_DAYS = "lastSevenDays",
  TODAY_IN_PRIOR_YEARS = "todayInPriorYears"
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
  LOADING_LATEST_TEMPERATURE = "LOADING_LATEST_TEMPERATURE",
  LATEST_TEMPERATURE_LOADED = "LATEST_TEMPERATURE_LOADED",
  FAILED_TO_LOAD_LATEST_TEMPERATURE = "FAILED_TO_LOAD_LATEST_TEMPERATURE",
  LOADING_LAST_24_HOURS = "LOADING_LAST_24_HOURS",
  LAST_24_HOURS_LOADED = "LAST_24_HOURS_LOADED",
  FAILED_TO_LOAD_LAST_24_HOURS = "FAILED_TO_LOAD_LAST_24_HOURS",
  LOADING_COMPARISON = "LOADING_COMPARISON",
  COMPARISON_LOADED = "COMPARISON_LOADED",
  PARTIAL_COMPARISON_LOAD = "PARTIAL_COMPARISON_LOAD",
  COMPLETED_COMPARISON_LOAD = "COMPLETED_COMPARISON_LOAD",
  FAILED_TO_LOAD_COMPARISON = "FAILED_TO_LOAD_COMPARISON",
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

export interface LoadingLatestTemperatureAction {
  type: ActionTypes.LOADING_LATEST_TEMPERATURE;
  meta: { stationId: string };
}

export interface LatestTemperatureLoadedAction {
  type: ActionTypes.LATEST_TEMPERATURE_LOADED;
  payload: { data: Temperature };
  meta: { stationId: string };
}

export interface FailedToLoadLatestTemperatureAction {
  type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE;
  error: Error;
  meta: { stationId: string };
}

export interface LoadingLast24HoursAction {
  type: ActionTypes.LOADING_LAST_24_HOURS;
  meta: { stationId: string };
}

export interface Last24HoursLoadedAction {
  type: ActionTypes.LAST_24_HOURS_LOADED;
  payload: {
    data: Temperature[];
    min: Temperature;
    max: Temperature;
    avg: Temperature;
  };
  meta: { stationId: string };
}

export interface FailedToLoadLast24HoursAction {
  type: ActionTypes.FAILED_TO_LOAD_LAST_24_HOURS;
  error: Error;
  meta: { stationId: string };
}

export interface LoadingComparisonAction {
  type: ActionTypes.LOADING_COMPARISON;
  meta: { stationId: string; comparisonId: ComparisonIds };
}

export interface ComparisonLoadedAction {
  type: ActionTypes.COMPARISON_LOADED;
  payload: {
    data: ComparisonList;
  };
  meta: { stationId: string; comparisonId: ComparisonIds };
}

export interface PartialComparisonLoadAction {
  type: ActionTypes.PARTIAL_COMPARISON_LOAD;
  payload: ComparisonItem;
  meta: { stationId: string; comparisonId: ComparisonIds };
}

export interface CompletedComparisonLoadAction {
  type: ActionTypes.COMPLETED_COMPARISON_LOAD;
  payload: { endReason: string };
  meta: { stationId: string; comparisonId: ComparisonIds };
}

export interface FailedToLoadComparisonAction {
  type: ActionTypes.FAILED_TO_LOAD_COMPARISON;
  error: Error;
  meta: { stationId: string; comparisonId: ComparisonIds };
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
  | LoadingLatestTemperatureAction
  | LatestTemperatureLoadedAction
  | FailedToLoadLatestTemperatureAction
  | LoadingLast24HoursAction
  | Last24HoursLoadedAction
  | FailedToLoadLast24HoursAction
  | LoadingComparisonAction
  | ComparisonLoadedAction
  | PartialComparisonLoadAction
  | CompletedComparisonLoadAction
  | FailedToLoadComparisonAction
  | LoadingTemperatureDataAction
  | SingleTemperatureLoadedAction
  | TemperatureRangeLoadedAction
  | ComparisonListLoadedAction
  | PartialComparisonListLoadAction
  | CompletedComparisonListLoadAction
  | FailedToLoadTemperatureDataAction;

export interface FetchDataStageTypes {
  loading: ActionTypes;
  fetched: ActionTypes;
  failed: ActionTypes;
}

interface FetchLatestTemperatureMeta {
  stationId: string;
}

export type FetchDataMeta = FetchLatestTemperatureMeta;

export interface LocalStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
}
