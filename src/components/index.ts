import Header, { HeaderComponentType } from "./Header";
import TemperatureScaleSelector, {
  TemperatureScaleSelectorComponentType
} from "./TemperatureScaleSelector";
import SelectStation, { SelectStationComponentType } from "./SelectStation";
import TemperatureValue, {
  TemperatureValueComponentType
} from "./TemperatureValue";

export interface ComponentTypes {
  Header: HeaderComponentType;
  TemperatureScaleSelector: TemperatureScaleSelectorComponentType;
  SelectStation: SelectStationComponentType;
  TemperatureValue: TemperatureValueComponentType;
}

export default {
  Header,
  TemperatureScaleSelector,
  SelectStation,
  TemperatureValue
};
