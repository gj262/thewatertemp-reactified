import React from "react";
import { Station } from "../types";
import "./SelectStation.css";

interface SelectStationProps {
  onChange: (station: Station) => void;
  loading?: boolean;
  station?: Station;
  stations?: Station[];
  _open?: boolean;
}

class SelectStation extends React.Component<
  SelectStationProps,
  { open: boolean; inputValue: string }
> {
  private rootRef: React.RefObject<HTMLDivElement>;
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: SelectStationProps) {
    super(props);
    this.rootRef = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      open: !!props._open,
      inputValue: props.station ? props.station.name : ""
    };
  }

  render() {
    const { loading, station, stations } = this.props;
    const { open, inputValue } = this.state;

    let filterValue = null;
    if (
      inputValue &&
      station &&
      inputValue.toLowerCase() !== station.name.toLowerCase()
    ) {
      filterValue = inputValue;
    }

    return (
      <div className="select-station" ref={this.rootRef}>
        <label htmlFor="stationSelection" className="visually-hidden">
          Choose a monitoring station
        </label>
        <input
          id="stationSelection"
          ref={this.inputRef}
          type="text"
          disabled={!!loading}
          placeholder={loading ? "Loading..." : "Select a monitoring station"}
          defaultValue={station && station.name}
          onFocus={this.onFocus}
          onClick={this.onClick}
          onKeyUp={this.onKeyUp}
          role="searchbox"
          aria-controls="station-list"
        />
        {open && station && stations && (
          <StationList
            station={station}
            stations={stations}
            onSelect={this.stationListSelect}
            filterValue={filterValue}
          />
        )}
      </div>
    );
  }

  onFocus = () => {
    if (this.inputRef.current) {
      this.inputRef.current.select();
    }
  };

  onClick = () => {
    const { open } = this.state;

    if (!open) {
      this.setState({ open: true });
    }
  };

  onKeyUp = () => {
    if (this.inputRef.current) {
      this.setState({ inputValue: this.inputRef.current.value });
    }
  };

  stationListSelect = (selectedStation: Station) => {
    const { station, onChange } = this.props;
    const { open } = this.state;

    if (this.inputRef.current) {
      this.inputRef.current.value = selectedStation.name;
    }

    this.setState({
      open: !open,
      inputValue: selectedStation.name
    });

    if (station && station.id !== selectedStation.id) {
      onChange(selectedStation);
    }
  };

  componentDidMount() {
    document.addEventListener("mouseup", this.handleDocumentClick);
    document.addEventListener("keyup", this.handleDocumentKey);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleDocumentClick);
    document.removeEventListener("keyup", this.handleDocumentKey);
  }

  handleDocumentClick = (e: MouseEvent) => {
    const { open } = this.state;

    if (
      open &&
      this.rootRef.current &&
      !this.rootRef.current.contains(e.target as Node)
    ) {
      this.closeAndRevert(e);
    }
  };

  handleDocumentKey = (e: KeyboardEvent) => {
    const { open } = this.state;

    if (open && e.keyCode === 27) {
      this.closeAndRevert(e);
    }
  };

  closeAndRevert(e: MouseEvent | KeyboardEvent) {
    const { station } = this.props;

    this.setState({
      open: false,
      inputValue: station ? station.name : ""
    });

    if (this.inputRef.current && station) {
      this.inputRef.current.value = station.name;
    }
  }
}

export default SelectStation;

interface StationListProps {
  station: Station;
  stations: Station[];
  onSelect: (station: Station) => void;
  filterValue: string | null;
}

class StationList extends React.Component<StationListProps> {
  private rootRef: React.RefObject<HTMLUListElement>;
  private selectedItemRef: React.RefObject<HTMLLIElement>;

  constructor(props: StationListProps) {
    super(props);
    this.rootRef = React.createRef();
    this.selectedItemRef = React.createRef();
  }

  render() {
    const { station, stations, onSelect, filterValue } = this.props;

    return (
      <ul id="station-list" ref={this.rootRef} role="listbox">
        {stations
          .filter(
            stn =>
              !filterValue ||
              stn.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
          )
          .map(stn => {
            const selected = !!(station && station.name === stn.name);

            return (
              <li
                key={stn.id}
                onClick={onSelect.bind({}, stn)}
                className={selected ? "selected" : ""}
                ref={selected ? this.selectedItemRef : null}
                role="option"
                aria-selected={selected}
              >
                {stn.name}
              </li>
            );
          })}
      </ul>
    );
  }

  componentDidMount() {
    this.scrollSelectedItemIntoView();
  }

  componentDidUpdate() {
    this.scrollSelectedItemIntoView();
  }

  scrollSelectedItemIntoView() {
    if (this.rootRef.current && this.selectedItemRef.current) {
      this.rootRef.current.scrollTop =
        this.selectedItemRef.current.offsetTop -
        this.rootRef.current.clientHeight / 2;
    }
  }
}
