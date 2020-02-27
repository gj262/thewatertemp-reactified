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

export enum ActionTypes {
  USER_PREFERENCES_LOADED = "USER_PREFERENCES_LOADED"
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
}
