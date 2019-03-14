import 'flatpickr/dist/themes/material_green.css';
import './DateWidget.css';

import React from 'react';
import Emoji from '../Emoji';
import Flatpickr from 'react-flatpickr';
import {parseISODate, formatISOPartialDate} from './dateHelpers';

// Returns datestring in the form "2011-11-11"
// Cannibalizes parts of us-form-system's DateWidget. Includes a Calendar date picker.
// ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx
export default class DateWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: parseISODate(this.props.value),
      invalidDate: false,
      touched: {
        month: false,
        day: false,
        year: false,
      },
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange({ dates, datestring }) {
    this.props.onChange(datestring);
  }

  isIncomplete({month, day, year}) {
    return
      !month || !day || !year
  }


  handleChange(field, value) {
    let newState = _.set(['value', field], value, this.state);
    newState = _.set(['touched', field], true, newState);

    this.setState(newState, () => {
      if (this.props.required && (this.isIncomplete(newState.value))) {
        this.props.onChange();
      } else {
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    });
  }

  render() {
    const {month, day, year} = this.state.value;
    const {invalidDate} = this.state;
    const flatpickrDate = (month && day && year) ?
      formatISOPartialDate({month,day,year}) : undefined;

    console.log("tell me about flatpickrDate", flatpickrDate)
    return (
      <div className="date-widget-container">
        <span
          className="usa-input-error-message"
          role="alert"
        >
          Please enter a valid date
        </span>
        <span> hiiiii {this.props.value} </span>


        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            maxDate: 'today',
            wrap: true,
            allowInput: false,
            enableTime: false,
          }}
          value={flatpickrDate}
          onChange={(dates, datestring) => this.onChange({ dates, datestring })}
        >
          <input className={`flatpickr-input-box`} type="text" data-input />
          <span className="flatpickr-input-button" title="toggle" data-toggle>
            <Emoji symbol="📅" label="calendar"/>
          </span>
        </Flatpickr>
      </div>
    );
  }
}
