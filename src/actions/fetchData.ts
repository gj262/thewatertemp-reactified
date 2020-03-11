import axios from "axios";
import { Dispatch } from "redux";
import { Temperature, TemperatureScale, TemperatureDataMeta, ActionTypes } from "../types";
import { DEFAULTS } from "../defaults";

export function fetchData(dispatch: Dispatch, meta: TemperatureDataMeta, path: string[], range: boolean) {
  dispatch({
    type: ActionTypes.LOADING_TEMPERATURE_DATA,
    meta
  });

  return axios
    .get(DEFAULTS.NOAA_API_HOSTNAME + DEFAULTS.TEMPERATURE_DATA_PATH + meta.stationId + "&" + path.join("&"))
    .then(response => {
      if (response.data && response.data.error && response.data.error.message) {
        throw new Error(response.data.error.message);
      }

      if (!response.data || !response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        throw new Error("No data was returned");
      }

      return response.data.data;
    })
    .then(cleanData)
    .then(data => {
      if (data.length === 0) {
        throw new Error("The data is unuseable");
      }

      dispatch({
        type: ActionTypes.TEMPERATURE_DATA_LOADED,
        payload: { data: range ? { min: min(data), max: max(data), avg: avg(data) } : data[0] },
        meta
      });
    })
    .catch(error => {
      try {
        console.log(error.toJSON());
        error = new Error(error.toJSON().message);
      } catch (e) {}
      dispatch({
        type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
        error,
        meta
      });
    });
}

export function cleanData(data: any[]): Temperature[] {
  return data
    .filter((datum: any) => datum.t && datum.v)
    .map(datum => {
      let value = 0;
      let time = "";
      try {
        value = parseFloat(datum.v);
        time = datum.t;
      } catch (e) {
        console.log(e.message);
        console.log("dropping: ", datum);
        value = 0;
      }
      return new Temperature(value, TemperatureScale.FAHRENHEIT, time);
    })
    .filter(t => t.value && t.timestamp);
}

export function min(data: Temperature[]) {
  return data.reduce((accumulator, current) => {
    if (current.value < accumulator.value) {
      accumulator = current;
    }
    return accumulator;
  }, data[0]);
}

export function max(data: Temperature[]) {
  return data.reduce((accumulator, current) => {
    if (current.value > accumulator.value) {
      accumulator = current;
    }
    return accumulator;
  }, data[0]);
}

export function avg(data: Temperature[]) {
  return new Temperature(data.reduce((accumulator, current) => accumulator + current.value, 0) / data.length, data[0].scale);
}
