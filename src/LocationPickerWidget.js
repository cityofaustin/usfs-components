import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import * as MapboxGl from 'mapbox-gl';

import Autosuggest from 'react-autosuggest';
import './LocationPickerWidget.css';
//importing the geocoder didnt seem to work at first
const MapboxGeocoder = require('mapbox-gl-geocoder');

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw',
});

const geocoderControl = new MapboxGeocoder({
  accessToken:
    'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw',
  placeholder: 'Enter a location here',
  // bounding box restricts results to Travis County
  bbox: [-98.173053, 30.02329, -97.369564, 30.627918],
});

const HERE_APP_ID = `NwvYKNdIJp8nYo74bUTU`;
const HERE_APP_CODE = `VHZxGy1nmghs2BCbo0cVCQ`;

class SelectLocationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [-97.7460479736328, 30.266184073558826],
    };
    this.onStyleLoad = this.onStyleLoad.bind(this);
  }

  onStyleLoad(map) {
    const geolocateControl = new MapboxGl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
    });

    map.addControl(geolocateControl, 'top-right');

    map.addSource('geojson-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    map.addLayer({
      id: 'geocoded-point',
      source: 'geojson-point',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf',
      },
    });

    map.addControl(geocoderControl, 'top-left');

    // using mapbox geocoder's event listener to show result
    // this ought to be linked up with or replace previous code
    geocoderControl.on('result', function(event) {
      map.getSource('geojson-point').setData(event.result.geometry);
    });

    map.resize();
  }

  render() {
    const { lat, lng } = this.props;
    return (
      <Map
        style={'mapbox://styles/croweatx/cjow5d6cd3l7g2snrvf17wf0r'}
        center={[lng, lat]}
        center={this.state.center}
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
const getSuggestionValue = suggestion => {
  return suggestion.name;
};

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

export default class LocationPickerWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
  }

  locationUpdated({ lngLat }) {
    var address = 'Dropped Pin';

    // Use here reverse geocoding to get a human readable address for the pin
    fetch(`
      https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${
        lngLat.lat
      }%2C${
      lngLat.lng
    }%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}`).then(
      response => {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status,
          );

          const location = {
            address: address,
            position: lngLat,
          };

          const valueJSON = JSON.stringify(location);

          this.props.onChange(valueJSON);

          return;
        }

        response.json().then(data => {
          address = data.Response.View[0].Result[0].Location.Address.Label;

          const location = {
            address: address,
            position: lngLat,
          };

          const valueJSON = JSON.stringify(location);

          this.props.onChange(valueJSON);
        });
      },
    );
  }

  onChange(event, { newValue }) {
    // Keep our current location until we pick a suggestion
    const valueJSON = this.props.value
      ? this.props.value
      : this.props.schema.formData;
    const location = JSON.parse(valueJSON);

    const newLocation = {
      address: newValue,
      position: location.position,
    };

    const newValueJSON = JSON.stringify(newLocation);

    this.props.onChange(newValueJSON);
  }

  onSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method },
  ) {
    if (suggestion.location) {
      const address = suggestionValue;
      const lng = suggestion.location[1];
      const lat = suggestion.location[0];

      const location = {
        address: address,
        position: { lng: lng, lat: lat },
      };

      const valueJSON = JSON.stringify(location);

      this.props.onChange(valueJSON);
    }

    // Unfocus the search bar
    this.autosuggestInput.blur();
  }

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested({ value }) {
    const inputLength = value.length;

    if (inputLength > 2) {
      const valueJSON = this.props.value
        ? this.props.value
        : this.props.schema.formData;
      const location = JSON.parse(valueJSON);

      fetch(
        `https://places.api.here.com/places/v1/autosuggest?at=${
          location.position.lat
        },${
          location.position.lng
        }&q=${value}&app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}`,
      )
        .then(response => {
          if (response.status !== 200) {
            console.log(
              'Looks like there was a problem. Status Code: ' + response.status,
            );
            this.setState({ suggestions: [] });
            return;
          }

          response.json().then(data => {
            const filteredResults = data.results.filter(
              result => result.position && result.vicinity,
            );
            const suggestions = filteredResults.map(result => ({
              name: result.title,
              location: result.position,
              humanAddress: result.vicinity.replace(/<br\/>/g, ', '),
            }));
            this.setState({ suggestions: suggestions });
          });
        })
        .catch(err => {
          console.log('Fetch Error :-S', err);
          this.setState({ suggestions: [] });
        });
    } else {
      this.setState({ suggestions: [] });
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
      value: '',
    });
  }

  getCurrentPosition() {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        const lngLat = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.locationUpdated({ lngLat });
      },
      error => {
        debugger;
      },
      { enableHighAccuracy: true },
    );
  }

  render() {
    const valueJSON = this.props.value
      ? this.props.value
      : this.props.schema.formData;
    const location = JSON.parse(valueJSON);

    const inputProps = {
      value: location.address,
      onChange: this.onChange,
    };

    return (
      <div>
        <div>
          <Autosuggest
            ref={autosuggest => {
              if (autosuggest !== null) {
                this.autosuggestInput = autosuggest.input;
              }
            }}
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          <div onClick={this.getCurrentPosition}>GET LOCATION</div>
        </div>
        <SelectLocationMap
          lat={location.position.lat}
          lng={location.position.lng}
          locationUpdated={this.locationUpdated}
        />
      </div>
    );
  }
}
