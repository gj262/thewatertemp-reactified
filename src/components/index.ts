import Header, { HeaderComponentType } from "./Header";
import TemperatureScaleSelector, {
  TemperatureScaleSelectorComponentType
} from "./TemperatureScaleSelector";
import SelectStation, { SelectStationComponentType } from "./SelectStation";

export interface ComponentTypes {
  Header: HeaderComponentType;
  TemperatureScaleSelector: TemperatureScaleSelectorComponentType;
  SelectStation: SelectStationComponentType;
}

export default {
  Header,
  TemperatureScaleSelector,
  SelectStation
};
