import { Dispatch } from "redux";
import axios from "axios";
import { Station, Temperature, ActionTypes, TemperatureScale } from "../types";
import { DEFAULTS } from "../defaults";

export function loadLatestTemperature(dispatch: Dispatch, station: Station) {
  dispatch({
    type: ActionTypes.LOADING_LATEST_TEMPERATURE,
    meta: { station }
  });

  return axios
    .get(
      DEFAULTS.LATEST_TEMPERATURE_HOSTNAME +
        DEFAULTS.LATEST_TEMPERATURE_PATH +
        station.id +
        "&date=latest"
    )
    .then(response => {
      if (
        !response.data ||
        !response.data.data ||
        !Array.isArray(response.data.data) ||
        response.data.data.length === 0
      ) {
        _dispatchLoadFailed(dispatch, station, "No data was returned");
        return;
      }

      const data = _cleanData(response.data.data);

      if (data.length === 0) {
        _dispatchLoadFailed(dispatch, station, "The data is unuseable");
        return;
      }

      dispatch({
        type: ActionTypes.LATEST_TEMPERATURE_LOADED,
        payload: { temperature: data[0] },
        meta: { station }
      });
    })
    .catch(error => {
      console.log(error.toJSON());
      _dispatchLoadFailed(dispatch, station, error.toJSON().message);
    });
}

function _dispatchLoadFailed(
  dispatch: Dispatch,
  station: Station,
  message: string
) {
  dispatch({
    type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
    error: new Error("Cannot load the temperature data"),
    meta: {
      message,
      station
    }
  });
}

function _cleanData(data: any[]): Temperature[] {
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
