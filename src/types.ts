export enum TemperatureScale {
  FAHRENHEIT = "FAHRENHEIT",
  CELSIUS = "CELSIUS"
}

export interface Station {
  id: string;
  name: string;
}

export class Temperature {
  value: number;
  scale: TemperatureScale;
  constructor(value: number, scale: TemperatureScale) {
    this.value = value;
    this.scale = scale;
  }
}

interface _UserPreferences {
  temperatureScale: TemperatureScale;
}

export type UserPreferences = _UserPreferences | null;

export enum ActionTypes {
  USER_PREFERENCES_LOADED = "USER_PREFERENCES_LOADED",
  USER_PREFERENCES_UPDATED = "USER_PREFERENCES_UPDATED"
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

export interface DispatchFunction {
  (action: Action): void;
}

export interface LocalStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
}
