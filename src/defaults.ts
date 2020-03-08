import { TemperatureScale, ComparisonIds } from "./types";

export const DEFAULTS = {
  TEMPERATURE_SCALE: TemperatureScale.FAHRENHEIT,
  NOAA_API_HOSTNAME: "https://tidesandcurrents.noaa.gov",
  STATION_LIST_PATH: "/mdapi/latest/webapi/stations.json?type=watertemp",
  STATION_ID: "9414290",
  LINK_TO_STATION: "https://tidesandcurrents.noaa.gov/stationhome.html?id=",
  TEMPERATURE_DATA_PATH: "/api/datagetter?product=water_temperature&format=json&units=english&time_zone=lst_ldt&station=",
  COMPARISON_ID: ComparisonIds.LAST_SEVEN_DAYS
};
