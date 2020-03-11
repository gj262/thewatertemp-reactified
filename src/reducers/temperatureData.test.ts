import reducer, {
  getTemperature,
  getTemperatureRange,
  getComparisonList,
  isLoading,
  loadFailed,
  getFailureMessage,
  getEndReason
} from "./temperatureData";
import {
  Action,
  ActionTypes,
  Temperature,
  TemperatureScale,
  TemperatureDataIds,
  SingleTemperatureLoadedAction,
  TemperatureRangeLoadedAction
} from "../types";

const testStationId = "22";
const otherStationId = "33";

it("should return an initial state (single)", () => {
  expect(getTemperature({}, testStationId, TemperatureDataIds.LATEST)).toBeNull();
});

it("should return an initial state (range)", () => {
  expect(getTemperatureRange({}, testStationId, TemperatureDataIds.LAST_24_HOURS)).toBeNull();
});

it("should return an initial state (comparison)", () => {
  expect(getComparisonList({}, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBeNull();
});

const sevenDayMeta = { stationId: testStationId, dataId: TemperatureDataIds.LAST_SEVEN_DAYS };

const sevenDayLoading: Action = {
  type: ActionTypes.LOADING_TEMPERATURE_DATA,
  meta: sevenDayMeta
};

it("knows about loading", () => {
  const stateAfterLoading = reducer({}, sevenDayLoading);

  expect(isLoading(stateAfterLoading, testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(true);
  expect(isLoading(stateAfterLoading, testStationId, TemperatureDataIds.LATEST)).toBe(false);
  expect(isLoading(stateAfterLoading, testStationId, TemperatureDataIds.LAST_24_HOURS)).toBe(false);
  expect(isLoading(stateAfterLoading, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
  expect(isLoading(stateAfterLoading, otherStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(false);
});

const singleTemperatureMeta = { stationId: testStationId, dataId: TemperatureDataIds.LATEST };

const singleTemperatureLoading: Action = {
  type: ActionTypes.LOADING_TEMPERATURE_DATA,
  meta: singleTemperatureMeta
};

const singleTemperatureLoads: SingleTemperatureLoadedAction = {
  type: ActionTypes.TEMPERATURE_DATA_LOADED,
  payload: {
    data: new Temperature(55.8, TemperatureScale.FAHRENHEIT, "2020-02-29 16:36")
  },
  meta: singleTemperatureMeta
};

it("loads (single)", () => {
  const stateAfterLoading = reducer(reducer({}, singleTemperatureLoading), singleTemperatureLoads);

  expect(getTemperature(stateAfterLoading, singleTemperatureMeta.stationId, singleTemperatureMeta.dataId)).toStrictEqual(
    singleTemperatureLoads.payload.data
  );
  expect(isLoading(stateAfterLoading, testStationId, TemperatureDataIds.LATEST)).toBe(false);
});

const rangeMeta = { stationId: testStationId, dataId: TemperatureDataIds.LAST_24_HOURS };

const rangeLoading: Action = {
  type: ActionTypes.LOADING_TEMPERATURE_DATA,
  meta: rangeMeta
};

const rangeLoads: TemperatureRangeLoadedAction = {
  type: ActionTypes.TEMPERATURE_DATA_LOADED,
  payload: {
    data: {
      min: new Temperature(32.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:42"),
      max: new Temperature(34.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:54"),
      avg: new Temperature(33.8, TemperatureScale.FAHRENHEIT)
    }
  },
  meta: rangeMeta
};

it("loads (range)", () => {
  const stateAfterLoading = reducer(reducer({}, rangeLoading), rangeLoads);

  expect(getTemperatureRange(stateAfterLoading, rangeMeta.stationId, rangeMeta.dataId)).toStrictEqual(rangeLoads.payload.data);
  expect(isLoading(stateAfterLoading, testStationId, TemperatureDataIds.LAST_24_HOURS)).toBe(false);
});

const sevenDayLoads: Action = {
  type: ActionTypes.TEMPERATURE_DATA_LOADED,
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

it("loads (comparison)", () => {
  const stateAfterLoad = reducer(reducer({}, sevenDayLoading), sevenDayLoads);

  expect(getComparisonList(stateAfterLoad, testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toStrictEqual(
    sevenDayLoads.payload.data
  );
  expect(isLoading(stateAfterLoad, testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(false);
  expect(getComparisonList(stateAfterLoad, otherStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBeNull();
  expect(getComparisonList(stateAfterLoad, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBeNull();
});

const priorYearMeta = { stationId: testStationId, dataId: TemperatureDataIds.TODAY_IN_PRIOR_YEARS };

const priorYearLoading: Action = {
  type: ActionTypes.LOADING_TEMPERATURE_DATA,
  meta: priorYearMeta
};

const firstPriorYearLoad: Action = {
  type: ActionTypes.PARTIAL_COMPARISON_LIST_LOAD,
  payload: {
    data: {
      regarding: "2019",
      range: {
        min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
        max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
        avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
      }
    }
  },
  meta: priorYearMeta
};

it("partially loads", () => {
  const stateAfterLoad = reducer(reducer({}, priorYearLoading), firstPriorYearLoad);

  expect(getComparisonList(stateAfterLoad, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload.data
  ]);
  expect(isLoading(stateAfterLoad, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(true);
  expect(getComparisonList(stateAfterLoad, otherStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBeNull();
  expect(getComparisonList(stateAfterLoad, testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBeNull();
});

const secondPriorYearLoad: Action = {
  type: ActionTypes.PARTIAL_COMPARISON_LIST_LOAD,
  payload: {
    data: {
      regarding: "2018",
      range: {
        min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2018-03-05 15:30"),
        max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2018-03-05 15:30"),
        avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
      }
    }
  },
  meta: priorYearMeta
};

it("partially loads more", () => {
  const stateAfterMultipleLoads = reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), secondPriorYearLoad);

  expect(getComparisonList(stateAfterMultipleLoads, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload.data,
    secondPriorYearLoad.payload.data
  ]);
  expect(isLoading(stateAfterMultipleLoads, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(true);
});

const completedLoad: Action = {
  type: ActionTypes.COMPLETED_COMPARISON_LIST_LOAD,
  payload: {
    endReason: "Tried years 2017, 2016, 2015"
  },
  meta: priorYearMeta
};

it("completes partial loading", () => {
  const completedState = reducer(
    reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), secondPriorYearLoad),
    completedLoad
  );

  expect(getComparisonList(completedState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload.data,
    secondPriorYearLoad.payload.data
  ]);
  expect(isLoading(completedState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
  expect(getEndReason(completedState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(
    completedLoad.payload.endReason
  );
});

const failure: Action = {
  type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
  error: new Error("Cannot load the latest temperature. Request failed with status code 500"),
  meta: sevenDayMeta
};

it("may fail to load", () => {
  expect(loadFailed(reducer({}, sevenDayLoading), testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(false);
  expect(loadFailed(reducer(reducer({}, sevenDayLoading), sevenDayLoads), testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(
    false
  );
  expect(loadFailed(reducer(reducer({}, sevenDayLoading), failure), testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(true);
});

it("provides the failure", () => {
  expect(getFailureMessage(reducer(reducer({}, sevenDayLoading), failure), testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(
    failure.error.message
  );
});

it("refresh is not loading", () => {
  const refreshState = reducer(reducer(reducer({}, sevenDayLoading), sevenDayLoads), sevenDayLoading);
  expect(isLoading(refreshState, testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(false);
});

it("refresh is not loading 2", () => {
  const refreshState = reducer(reducer(reducer(reducer({}, sevenDayLoading), sevenDayLoads), sevenDayLoading), sevenDayLoads);
  expect(isLoading(refreshState, testStationId, TemperatureDataIds.LAST_SEVEN_DAYS)).toBe(false);
});

it("refresh is not loading 3", () => {
  const refreshState = reducer(
    reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), completedLoad),
    priorYearLoading
  );
  expect(isLoading(refreshState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
});

it("refresh is not loading 4", () => {
  const refreshState = reducer(
    reducer(reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), completedLoad), priorYearLoading),
    firstPriorYearLoad
  );
  expect(isLoading(refreshState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toBe(false);
});

it("refresh updates data", () => {
  const refreshState = reducer(
    reducer(reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), secondPriorYearLoad), completedLoad),
    priorYearLoading
  );
  expect(getComparisonList(refreshState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    firstPriorYearLoad.payload.data,
    secondPriorYearLoad.payload.data
  ]);
});

const updatedPriorYearLoad: Action = {
  type: ActionTypes.PARTIAL_COMPARISON_LIST_LOAD,
  payload: {
    data: {
      regarding: "2019",
      range: {
        min: new Temperature(36.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
        max: new Temperature(37.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
        avg: new Temperature(38.6, TemperatureScale.FAHRENHEIT)
      }
    }
  },
  meta: priorYearMeta
};

it("refresh updates data 2", () => {
  const refreshState = reducer(
    reducer(
      reducer(reducer(reducer(reducer({}, priorYearLoading), firstPriorYearLoad), secondPriorYearLoad), completedLoad),
      priorYearLoading
    ),
    updatedPriorYearLoad
  );
  expect(getComparisonList(refreshState, testStationId, TemperatureDataIds.TODAY_IN_PRIOR_YEARS)).toStrictEqual([
    updatedPriorYearLoad.payload.data,
    secondPriorYearLoad.payload.data
  ]);
});
