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
}

export enum TemperatureScale {
  FAHRENHEIT = "FAHRENHEIT",
  CELSIUS = "CELSIUS"
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
  FAILED_TO_LOAD_LATEST_TEMPERATURE = "FAILED_TO_LOAD_LATEST_TEMPERATURE"
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
  payload: { temperature: Temperature };
  meta: { stationId: string };
}

export interface FailedToLoadLatestTemperatureAction {
  type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE;
  error: Error;
  meta: { stationId: string };
}

export type Action =
  | UserPreferencesLoadedAction
  | UserPreferencesUpdatedAction
  | LoadingStationsAction
  | StationsLoadedAction
  | FailedToLoadStationsAction
  | LoadingLatestTemperatureAction
  | LatestTemperatureLoadedAction
  | FailedToLoadLatestTemperatureAction;

export interface LocalStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
}
