import { Dispatch } from "redux";
import axios from "axios";
import { ActionTypes, Station, LocalStorage } from "../types";
import { DEFAULTS } from "../defaults";

const STATIONS = "stations";

export function loadStations(dispatch: Dispatch, localStorage: LocalStorage) {
  const stored = localStorage.getItem(STATIONS);
  let stations;
  if (stored) {
    try {
      stations = JSON.parse(stored).stations;
    } catch (e) {}
  }
  if (stations) {
    dispatch({
      type: ActionTypes.STATIONS_LOADED,
      payload: { stations }
    });
  }

  dispatch({
    type: ActionTypes.LOADING_STATIONS
  });

  return axios
    .get(DEFAULTS.NOAA_API_HOSTNAME + DEFAULTS.STATION_LIST_PATH)
    .then(response => {
      if (response.data && response.data.error && response.data.error.message) {
        _dispatchLoadFailed(dispatch, response.data.error.message);
        return;
      }

      if (
        !response.data ||
        !response.data.stations ||
        !Array.isArray(response.data.stations) ||
        response.data.stations.length === 0
      ) {
        _dispatchLoadFailed(dispatch, "No stations were returned");
        return;
      }

      const stations = _cleanStations(response.data.stations);

      if (stations.length === 0) {
        _dispatchLoadFailed(dispatch, "The station data is unuseable");
        return;
      }

      dispatch({
        type: ActionTypes.STATIONS_LOADED,
        payload: { stations }
      });

      localStorage.setItem(STATIONS, JSON.stringify({ stations }));
    })
    .catch(error => {
      console.log(error.toJSON());
      dispatch({
        type: ActionTypes.FAILED_TO_LOAD_STATIONS,
        error: new Error("Cannot load the stations list. " + error.toJSON().message)
      });
    });
}

function _dispatchLoadFailed(dispatch: Dispatch, message: string) {
  dispatch({
    type: ActionTypes.FAILED_TO_LOAD_STATIONS,
    error: new Error("Cannot load the stations list. " + message)
  });
}

function _cleanStations(stations: any[]): Station[] {
  return stations
    .filter((station: Station) => station.id && station.name)
    .map((station: Station) => {
      return {
        id: station.id,
        name: station.name + (station.state ? ", " + station.state : ""),
        ...(station.state ? { state: station.state } : {})
      };
    });
}
