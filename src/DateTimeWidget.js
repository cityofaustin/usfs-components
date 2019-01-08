import 'flatpickr/dist/themes/material_green.css';

import React from 'react';
import Flatpickr from 'react-flatpickr';

export default class DateTimeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange({ dates, datestring }) {
    this.props.onChange(datestring);
  }

  render() {
    return (
      <Flatpickr
        data-enable-time
        value={[this.props.value]}
        onChange={(dates, datestring) => this.onChange({ dates, datestring })}
      />
    );
  }
}
