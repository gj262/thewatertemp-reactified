import { Dispatch } from "redux";
import { AxiosPromise } from "axios";
import { UserPreferences, LocalStorage } from "../types";
import * as forUserPreferences from "./userPreferences";
import * as forStations from "./stations";
import * as forLatestTemperature from "./latestTemperature";
import * as forLast24Hours from "./last24Hours";
import * as forLastSevenDayComparison from "./lastSevenDayComparison";
import * as forTodayInPriorYearsComparison from "./todayInPriorYears";

export default function makeActions(dispatch: Dispatch, localStorage: LocalStorage): ActionMethods {
  return {
    loadUserPreferences: forUserPreferences.loadUserPreferences.bind({}, dispatch, localStorage),
    updateUserPreferences: forUserPreferences.updateUserPreferences.bind({}, dispatch, localStorage),
    loadStations: forStations.loadStations.bind({}, dispatch, localStorage),
    loadLatestTemperature: forLatestTemperature.loadLatestTemperature.bind({}, dispatch),
    loadLast24Hours: forLast24Hours.loadLast24Hours.bind({}, dispatch),
    loadLastSevenDayComparison: forLastSevenDayComparison.loadLastSevenDayComparison.bind({}, dispatch),
    loadTodayInPriorYearsComparison: forTodayInPriorYearsComparison.loadTodayInPriorYears.bind({}, dispatch)
  };
}

export interface ActionMethods {
  loadUserPreferences: () => void;
  updateUserPreferences: (userPreferences: UserPreferences) => void;
  loadStations: () => Promise<void>;
  loadLatestTemperature: (stationId: string) => Promise<void>;
  loadLast24Hours: (stationId: string) => Promise<void>;
  loadLastSevenDayComparison: (stationId: string, latestStationTime: Date) => Promise<void>;
  loadTodayInPriorYearsComparison: (stationId: string, latestStationTime: Date, endAfter?: number) => AxiosPromise;
}
