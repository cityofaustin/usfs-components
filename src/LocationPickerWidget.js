import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "./LocationPickerWidget.css";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw"
});

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
        style={"mapbox://styles/croweatx/cjow5d6cd3l7g2snrvf17wf0r"}
        center={[lng, lat]}
        onStyleLoad={this.onStyleLoad}
      >
        <Layer
          type="symbol"
          id="selectedLocation"
          layout={{
            "icon-image": "marker-open-small",
            "icon-allow-overlap": true
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

export default class LocationPickerWidget extends React.Component {
  constructor(props) {
    super(props);

    this.locationUpdated = this.locationUpdated.bind(this);
  }

  locationUpdated({ lngLat }) {
    const location = {
      address: "Dropped Pin",
      position: lngLat
    };

    const valueJSON = JSON.stringify(location);

    this.props.onChange(valueJSON);
  }

  render() {
    const valueJSON = this.props.value
      ? this.props.value
      : this.props.schema.formData;
    const location = JSON.parse(valueJSON);

    return (
      <div>
        <h3>{location.address}</h3>
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
