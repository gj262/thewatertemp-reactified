export interface Station {
  id: string;
  name: string;
  state?: string;
}

export class Temperature {
  value: number;
  scale: TemperatureScale;
  constructor(value: number, scale: TemperatureScale) {
    this.value = value;
    this.scale = scale;
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

export interface APIFailure {
  error: Error;
  message: string;
}

export enum ActionTypes {
  USER_PREFERENCES_LOADED = "USER_PREFERENCES_LOADED",
  USER_PREFERENCES_UPDATED = "USER_PREFERENCES_UPDATED",
  LOADING_STATIONS = "LOADING_STATIONS",
  STATIONS_LOADED = "STATIONS_LOADED",
  FAILED_TO_LOAD_STATIONS = "FAILED_TO_LOAD_STATIONS"
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
  meta: { message: string };
}

export type Action =
  | UserPreferencesLoadedAction
  | UserPreferencesUpdatedAction
  | LoadingStationsAction
  | StationsLoadedAction
  | FailedToLoadStationsAction;

export interface LocalStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
}
