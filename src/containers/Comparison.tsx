import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
//import "./Comparison.css";
import { RootState } from "../reducers";
import makeActions, { ActionTypes } from "../actions";
import AllComponents, { ComponentTypes } from "../components";
import { ComparisonIds, ComparisonDescription } from "../types";

export type ComparisonProps = PropsFromAbove &
  PropsFromStore &
  PropsFromDependencyInjection;

export interface PropsFromAbove {
  stationId: string;
  latestStationTime: Date;
  comparisonId: ComparisonIds;
  onComparisonChange: (id: ComparisonIds) => void;
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
    { id: ComparisonIds.LAST_SEVEN_DAYS, label: "Last 7 days" },
    { id: ComparisonIds.TODAY_IN_PRIOR_YEARS, label: "Today in prior years" }
  ];

  render() {
    const { Components, comparisonId, onComparisonChange } = this.props;

    return (
      <div className="comparison">
        <Components.ChooseComparison
          selectedId={comparisonId}
          comparisons={this.comparisons}
          onChange={onComparisonChange}
        />
        <Components.CompareWith list={[]} />
      </div>
    );
  }

  componentDidMount() {
    this.loadComparison();
  }

  loadComparison() {
    const { actions, stationId, comparisonId, latestStationTime } = this.props;

    switch (comparisonId) {
      case ComparisonIds.LAST_SEVEN_DAYS:
        actions.loadLastSevenDayComparison(stationId, latestStationTime);
        break;
      case ComparisonIds.TODAY_IN_PRIOR_YEARS:
        actions.loadTodayInPriorYearsComparison(stationId, latestStationTime);
        break;
      default:
        throw new Error("Unimplemented comparison: " + comparisonId);
    }
  }

  componentDidUpdate(prevProps: ComparisonProps) {
    const { stationId, comparisonId } = this.props;

    if (
      stationId !== prevProps.stationId ||
      comparisonId !== prevProps.comparisonId
    ) {
      this.loadComparison();
    }
  }
}

// Store -> Dependency Injection -> Comparison Container

const InjectComponentsAndActions: React.FunctionComponent<PropsFromAbove &
  PropsFromStore> = props => (
  <Comparison
    {...props}
    actions={makeActions(props.dispatch, window.localStorage)}
    Components={AllComponents}
  />
);

interface PropsFromDependencyInjection {
  actions: ComparisonActionTypes;
  Components: ComparisonComponentTypes;
}

const mapStateToProps = (state: RootState) => {
  return {};
};

const InjectStoreData: React.FunctionComponent<PropsFromAbove> = connect(
  mapStateToProps
)(InjectComponentsAndActions);

interface PropsFromStore {
  dispatch: Dispatch;
}

export default InjectStoreData;
