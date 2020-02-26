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
