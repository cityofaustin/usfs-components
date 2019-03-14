import 'flatpickr/dist/themes/material_green.css';
import './DateTimeWidget.css';

import React from 'react';
import Emoji from './Emoji';
import Flatpickr from 'react-flatpickr';

// Returns datestring in the form "2011-11-11 11:11"
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
        options={{
          maxDate: 'today'
        }}
        value={[this.props.value]}
        onChange={(dates, datestring) => this.onChange({ dates, datestring })}
      >
        <input className={`flatpickr-input-box`} type="text" data-input />
        <span className="flatpickr-input-button" title="toggle" data-toggle>
          <Emoji symbol="📅" label="calendar"/>
        </span>
      </Flatpickr>
    );
  }
}
