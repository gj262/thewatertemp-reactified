import Header, { HeaderComponentType } from "./Header";
import TemperatureScaleSelector, { TemperatureScaleSelectorComponentType } from "./TemperatureScaleSelector";
import SelectStation, { SelectStationComponentType } from "./SelectStation";
import TemperatureValue, { TemperatureValueComponentType } from "./TemperatureValue";
import TemperatureRange, { TemperatureRangeComponentType } from "./TemperatureRange";
import ChooseComparison, { ChooseComparisonComponentType } from "./ChooseComparison";
import CompareWith, { CompareWithComponentType } from "./CompareWith";

export interface ComponentTypes {
  Header: HeaderComponentType;
  TemperatureScaleSelector: TemperatureScaleSelectorComponentType;
  SelectStation: SelectStationComponentType;
  TemperatureValue: TemperatureValueComponentType;
  TemperatureRange: TemperatureRangeComponentType;
  ChooseComparison: ChooseComparisonComponentType;
  CompareWith: CompareWithComponentType;
}

export default {
  Header,
  TemperatureScaleSelector,
  SelectStation,
  TemperatureValue,
  TemperatureRange,
  ChooseComparison,
  CompareWith
};
