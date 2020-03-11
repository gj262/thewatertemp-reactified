import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../reducers";
import makeActions, { ActionTypes } from "../actions";
import AllComponents, { ComponentTypes } from "../components";
import { ComparisonDescription, ComparisonList, TemperatureDataIds } from "../types";
import * as fromTemperatureData from "../reducers/temperatureData";
import * as fromUserPreferences from "../reducers/userPreferences";

export type ComparisonProps = PropsFromAbove & PropsFromStore & PropsFromDependencyInjection;

export interface PropsFromAbove {
  stationId: string;
  latestStationTime: Date;
  comparisonId: TemperatureDataIds;
  onComparisonChange: (id: TemperatureDataIds) => void;
}

export interface ComparisonComponentTypes {
  CompareWith: ComponentTypes["CompareWith"];
  ChooseComparison: ComponentTypes["ChooseComparison"];
}

export interface ComparisonActionTypes {
  loadLastSevenDayComparison: ActionTypes["loadLastSevenDayComparison"];
  loadTodayInPriorYearsComparison: ActionTypes["loadTodayInPriorYearsComparison"];
}

export class Comparison extends React.Component<ComparisonProps> {
  comparisons: ComparisonDescription[] = [
    { id: TemperatureDataIds.LAST_SEVEN_DAYS, label: "Last 7 days" },
    { id: TemperatureDataIds.TODAY_IN_PRIOR_YEARS, label: "Today in prior years" }
  ];

  render() {
    const { Components, comparisonId, onComparisonChange, list, isLoading, endReason } = this.props;

    return (
      <div className="comparison">
        <Components.ChooseComparison selectedId={comparisonId} comparisons={this.comparisons} onChange={onComparisonChange} />
        <Components.CompareWith list={list || []} isLoading={isLoading} endReason={endReason || undefined} />
      </div>
    );
  }

  componentDidMount() {
    this.loadComparison();
  }

  loadComparison() {
    const { actions, stationId, comparisonId, latestStationTime } = this.props;

    switch (comparisonId) {
      case TemperatureDataIds.LAST_SEVEN_DAYS:
        actions.loadLastSevenDayComparison(stationId, latestStationTime);
        break;
      case TemperatureDataIds.TODAY_IN_PRIOR_YEARS:
        actions.loadTodayInPriorYearsComparison(stationId, latestStationTime);
        break;
      default:
        throw new Error("Unimplemented comparison: " + comparisonId);
    }
  }

  componentDidUpdate(prevProps: ComparisonProps) {
    const { stationId, comparisonId } = this.props;

    if (stationId !== prevProps.stationId || comparisonId !== prevProps.comparisonId) {
      this.loadComparison();
    }
  }
}

// Store -> Dependency Injection -> Comparison Container

const InjectComponentsAndActions: React.FunctionComponent<PropsFromAbove & PropsFromStore> = props => (
  <Comparison {...props} actions={makeActions(props.dispatch, window.localStorage)} Components={AllComponents} />
);

interface PropsFromDependencyInjection {
  actions: ComparisonActionTypes;
  Components: ComparisonComponentTypes;
}

const mapStateToProps = (state: RootState, ownProps: PropsFromAbove) => {
  const userPreferences = fromUserPreferences.getUserPreferences(state.userPreferences);
  let list = fromTemperatureData.getComparisonList(state.temperatureData, ownProps.stationId, ownProps.comparisonId);

  if (userPreferences && list) {
    list = list.map(item => {
      if (item.range) {
        return {
          ...item,
          range: {
            min: item.range.min.usingScale(userPreferences.temperatureScale),
            max: item.range.max.usingScale(userPreferences.temperatureScale),
            avg: item.range.avg.usingScale(userPreferences.temperatureScale)
          }
        };
      }
      return item;
    });
  }

  return {
    list,
    isLoading: fromTemperatureData.isLoading(state.temperatureData, ownProps.stationId, ownProps.comparisonId),
    endReason: fromTemperatureData.getEndReason(state.temperatureData, ownProps.stationId, ownProps.comparisonId)
  };
};

const InjectStoreData: React.FunctionComponent<PropsFromAbove> = connect(mapStateToProps)(InjectComponentsAndActions);

interface PropsFromStore {
  dispatch: Dispatch;
  list: ComparisonList | null;
  isLoading: boolean;
  endReason: string | null;
}

export type ComparisonContainerType = React.FunctionComponent<PropsFromAbove>;

export default InjectStoreData;
