import { TemperatureScale } from "./types";

export const DEFAULTS = {
  TEMPERATURE_SCALE: TemperatureScale.FAHRENHEIT,
  STATION_LIST_HOSTNAME: "https://tidesandcurrents.noaa.gov",
  STATION_LIST_PATHNAME: "/mdapi/latest/webapi/stations.json?type=watertemp"
};
