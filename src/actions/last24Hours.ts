import { Dispatch } from "redux";

import { fetchData } from "./fetchData";
import { TemperatureDataIds } from "../types";

export function loadLast24Hours(dispatch: Dispatch, stationId: string) {
  return fetchData(dispatch, { stationId, dataId: TemperatureDataIds.LAST_24_HOURS }, ["range=24"], true);
}
