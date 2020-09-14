import { TemperatureScale, TemperatureDataIds } from "./types";

export const DEFAULTS = {
  TEMPERATURE_SCALE: TemperatureScale.FAHRENHEIT,
  NOAA_API_HOSTNAME: "https://api.tidesandcurrents.noaa.gov",
  STATION_LIST_PATH: "/mdapi/prod/webapi/stations.json?type=watertemp",
  STATION_ID: "9414290",
  LINK_TO_STATION: "https://tidesandcurrents.noaa.gov/stationhome.html?id=",
  TEMPERATURE_DATA_PATH: "/api/prod/datagetter?product=water_temperature&format=json&units=english&time_zone=lst_ldt&station=",
  COMPARISON_ID: TemperatureDataIds.LAST_SEVEN_DAYS
};
