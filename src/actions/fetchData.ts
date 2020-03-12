import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { Temperature, TemperatureScale, TemperatureDataMeta, ActionTypes } from "../types";

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

export function getDataFromResponseOrReject(response: AxiosResponse): any[] {
  if (response.data && response.data.error && response.data.error.message) {
    throw new Error(response.data.error.message);
  }

  if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
    throw new Error("Bad response");
  }

  return response.data.data;
}

export function rejectNoData(data: Temperature[]): Temperature[] {
  if (data.length === 0) {
    throw new Error("The data is unuseable");
  }
  return data;
}

export function handleError(error: any, dispatch: Dispatch, meta: TemperatureDataMeta) {
  try {
    console.log(error.toJSON());
    error = new Error(error.toJSON().message);
  } catch (e) {}
  dispatch({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error,
    meta
  });
}
