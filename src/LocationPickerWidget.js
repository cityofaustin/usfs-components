import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import Autosuggest from 'react-autosuggest';
import './LocationPickerWidget.css';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw',
});

const HERE_APP_ID = `NwvYKNdIJp8nYo74bUTU`;
const HERE_APP_CODE = `VHZxGy1nmghs2BCbo0cVCQ`;

class SelectLocationMap extends Component {
  constructor(props) {
    super(props);

    this.onStyleLoad = this.onStyleLoad.bind(this);
  }

  onStyleLoad(map) {
    map.resize();
  }

  render() {
    const { lat, lng } = this.props;
    return (
      <Map
        style={'mapbox://styles/croweatx/cjow5d6cd3l7g2snrvf17wf0r'}
        center={[lng, lat]}
        onStyleLoad={this.onStyleLoad}
      >
        <Layer
          type="symbol"
          id="selectedLocation"
          layout={{
            'icon-image': 'marker-open-small',
            'icon-allow-overlap': true,
          }}
        >
          <Feature
            coordinates={[lng, lat]}
            draggable={true}
            onDragEnd={this.props.locationUpdated}
          />
        </Layer>
      </Map>
    );
  }
}

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
  {
    name: 'C',
    year: 1972,
  },
  {
    name: 'Elm',
    year: 2012,
  },
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : languages.filter(
        lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue,
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

export default class LocationPickerWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
    };

    this.locationUpdated = this.locationUpdated.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this,
    );
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this,
    );
  }

  locationUpdated({ lngLat }) {
    const location = {
      address: 'Dropped Pin',
      position: lngLat,
    };

    const valueJSON = JSON.stringify(location);

    this.props.onChange(valueJSON);
  }

  onChange(event, { newValue }) {
    debugger;
    this.setState({
      value: newValue,
    });
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value),
    });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
      value: '',
    });
  }

  render() {
    const valueJSON = this.props.value
      ? this.props.value
      : this.props.schema.formData;
    const location = JSON.parse(valueJSON);

    const inputProps = {
      placeholder: 'Type a programming language',
      value: this.state.value,
      onChange: this.onChange,
    };

    return (
      <div>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <div>
          <SelectLocationMap
            lat={location.position.lat}
            lng={location.position.lng}
            locationUpdated={this.locationUpdated}
          />
        </div>
      </div>
    );
  }
}
