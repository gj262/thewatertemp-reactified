import Header, { HeaderComponentType } from "./Header";
import TemperatureScaleSelector, {
  TemperatureScaleSelectorComponentType
} from "./TemperatureScaleSelector";

export interface ComponentTypes {
  Header: HeaderComponentType;
  TemperatureScaleSelector: TemperatureScaleSelectorComponentType;
}

export default {
  Header,
  TemperatureScaleSelector
};
