import Header, { HeaderComponentType } from "./Header";
import TemperatureScaleSelector, {
  TemperatureScaleSelectorComponentType
} from "./TemperatureScaleSelector";
import SelectStation, { SelectStationComponentType } from "./SelectStation";
import TemperatureValue, {
  TemperatureValueComponentType
} from "./TemperatureValue";
import TemperatureRange, {
  TemperatureRangeComponentType
} from "./TemperatureRange";

export interface ComponentTypes {
  Header: HeaderComponentType;
  TemperatureScaleSelector: TemperatureScaleSelectorComponentType;
  SelectStation: SelectStationComponentType;
  TemperatureValue: TemperatureValueComponentType;
  TemperatureRange: TemperatureRangeComponentType;
}

export default {
  Header,
  TemperatureScaleSelector,
  SelectStation,
  TemperatureValue,
  TemperatureRange
};
