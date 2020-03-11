import { Dispatch } from "redux";

import { fetchData } from "./fetchData";
import { TemperatureDataIds } from "../types";

export function loadLatestTemperature(dispatch: Dispatch, stationId: string) {
  return fetchData(dispatch, { stationId, dataId: TemperatureDataIds.LATEST }, ["date=latest"], false);
}
