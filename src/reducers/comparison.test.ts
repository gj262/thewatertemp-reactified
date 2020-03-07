import reducer, { getComparison, isLoading, loadFailed, getFailureMessage, getEndReason } from "./comparison";
import { Action, ActionTypes, Temperature, TemperatureScale, ComparisonIds } from "../types";

const testStationId = "22";
const otherStationId = "33";
const sevenDayMeta = { stationId: testStationId, comparisonId: ComparisonIds.LAST_SEVEN_DAYS };

it("should return an initial state", () => {
  expect(getComparison({}, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBeNull();
});

const sevenDayLoading: Action = {
  type: ActionTypes.LOADING_COMPARISON,
  meta: sevenDayMeta
};

it("knows about loading", () => {
  const stateAfterLoading = reducer({}, sevenDayLoading);

  expect(isLoading(stateAfterLoading, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(true);
  expect(isLoading(stateAfterLoading, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
  expect(isLoading(stateAfterLoading, otherStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(false);
});

const sevenDayLoads: Action = {
  type: ActionTypes.COMPARISON_LOADED,
  payload: {
    data: [
      {
        regarding: "Thursday",
        range: {
          min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2020-03-05 15:30"),
          max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2020-03-05 15:30"),
          avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
        }
      },
      {
        regarding: "Wednesday",
        range: {
          min: new Temperature(32.6, TemperatureScale.FAHRENHEIT, "2020-03-04 15:30"),
          max: new Temperature(32.6, TemperatureScale.FAHRENHEIT, "2020-03-04 15:30"),
          avg: new Temperature(32.6, TemperatureScale.FAHRENHEIT)
        }
      }
    ]
  },
  meta: sevenDayMeta
};

it("loads", () => {
  const stateAfterLoad = reducer(reducer({}, sevenDayLoading), sevenDayLoads);

  expect(getComparison(stateAfterLoad, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toStrictEqual(sevenDayLoads.payload.data);
  expect(isLoading(stateAfterLoad, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(false);
  expect(getComparison(stateAfterLoad, otherStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBeNull();
  expect(getComparison(stateAfterLoad, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBeNull();
});

const priorYearMeta = { stationId: testStationId, comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS };

const priorYearLoading: Action = {
  type: ActionTypes.LOADING_COMPARISON,
  meta: priorYearMeta
};

const firstPriorYearLoad: Action = {
  type: ActionTypes.PARTIAL_COMPARISON_LOAD,
  payload: {
    regarding: "2019",
    range: {
      min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
      max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
      avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
    }
  },
  meta: priorYearMeta
};

it("partially loads", () => {
  const stateAfterLoad = reducer(reducer({}, priorYearLoading), firstPriorYearLoad);

  expect(getComparison(stateAfterLoad, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload
  ]);
  expect(isLoading(stateAfterLoad, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(true);
  expect(getComparison(stateAfterLoad, otherStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBeNull();
  expect(getComparison(stateAfterLoad, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBeNull();
});

const secondPriorYearLoad: Action = {
  type: ActionTypes.PARTIAL_COMPARISON_LOAD,
  payload: {
    regarding: "2018",
    range: {
      min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2018-03-05 15:30"),
      max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2018-03-05 15:30"),
      avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
    }
  },
  meta: priorYearMeta
};

it("partially loads more", () => {
  const stateAfterMultipleLoads = reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), secondPriorYearLoad);

  expect(getComparison(stateAfterMultipleLoads, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload,
    secondPriorYearLoad.payload
  ]);
  expect(isLoading(stateAfterMultipleLoads, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(true);
});

const completedLoad: Action = {
  type: ActionTypes.COMPLETED_COMPARISON_LOAD,
  payload: {
    endDueTo: "Tried years 2017, 2016, 2015"
  },
  meta: priorYearMeta
};

it("completes partial loading", () => {
  const completedState = reducer(
    reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), secondPriorYearLoad),
    completedLoad
  );

  expect(getComparison(completedState, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload,
    secondPriorYearLoad.payload
  ]);
  expect(isLoading(completedState, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
  expect(getEndReason(completedState, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(completedLoad.payload.endDueTo);
});

const failure: Action = {
  type: ActionTypes.FAILED_TO_LOAD_COMPARISON,
  error: new Error("Cannot load the latest temperature. Request failed with status code 500"),
  meta: sevenDayMeta
};

it("may fail to load", () => {
  expect(loadFailed(reducer({}, sevenDayLoading), testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(false);
  expect(loadFailed(reducer(reducer({}, sevenDayLoading), sevenDayLoads), testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(
    false
  );
  expect(loadFailed(reducer(reducer({}, sevenDayLoading), failure), testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(true);
});

it("provides the failure", () => {
  expect(getFailureMessage(reducer(reducer({}, sevenDayLoading), failure), testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(
    failure.error.message
  );
});

it("refresh is not loading", () => {
  const refreshState = reducer(reducer(reducer({}, sevenDayLoading), sevenDayLoads), sevenDayLoading);
  expect(isLoading(refreshState, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(false);
});

it("refresh is not loading 2", () => {
  const refreshState = reducer(reducer(reducer(reducer({}, sevenDayLoading), sevenDayLoads), sevenDayLoading), sevenDayLoads);
  expect(isLoading(refreshState, testStationId, ComparisonIds.LAST_SEVEN_DAYS)).toBe(false);
});

it("refresh is not loading 3", () => {
  const refreshState = reducer(
    reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), completedLoad),
    priorYearLoading
  );
  expect(isLoading(refreshState, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
});

it("refresh is not loading 4", () => {
  const refreshState = reducer(
    reducer(reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), completedLoad), priorYearLoading),
    firstPriorYearLoad
  );
  expect(isLoading(refreshState, testStationId, ComparisonIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
});
