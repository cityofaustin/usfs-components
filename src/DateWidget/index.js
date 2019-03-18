import PropTypes from 'prop-types';
import React from 'react';
import Emoji from '../Emoji';
import Flatpickr from 'react-flatpickr';
import { set, cloneDeep } from 'lodash';

import {formatYear, formatDayMonth, parseISODate, formatISOPartialDate} from './dateHelpers';

import 'flatpickr/dist/themes/material_green.css';
import './DateWidget.css';

// Returns datestring in the form "2011-11-11"
// Uses parts of us-form-system's DateWidget. Includes a Calendar date picker.
// ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx
export default class DateWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: parseISODate(this.props.value),
      touched: {
        month: false,
        day: false,
        year: false,
      },
    }
    this.onChange = this.onChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFlatpickrChange = this.handleFlatpickrChange.bind(this);
  }

  onChange({ dates, datestring }) {
    this.props.onChange(datestring);
  }

  isIncomplete({month, day, year}) {
    return (!month || !day || !year)
  }

  handleFormChange(field, value) {
    const currentYear = (new Date()).getFullYear();

    if (field === "month") {
      if ((value > 12)) {
        return
      }
      if (value < 1) {
        value = "";
      }
    }
    if (field === "day") {
      if (value > 31) {
        return
      }
      if (value < 1) {
        value = "";
      }
    }
    if (field === "year") {
      if (value > currentYear) {
        value = currentYear;
      }
      if (value < 1) {
        value = "";
      }
    }

    let newState = cloneDeep(this.state);
    let formatter = (field === "year") ? formatYear : formatDayMonth;

    set(newState, ["value", field], formatter(value));
    set(newState, ['touched', field], true);

    // Autofill year after filling month and day
    if (
      (
        ((field === "day") && (!!this.state.value.month)) ||
        ((field === "month") && (!!this.state.value.day))
      ) && (this.state.value.year === "")
    ) {
      set(newState, ['value', "year"], currentYear);
    }

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        // console.log("Sending nothing")
        this.props.onChange();
      } else {
        // console.log("Sending", formatISOPartialDate(newState.value))
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    });
  }

  handleFlatpickrChange(dateString) {
    let newState = cloneDeep(this.state);
    set(newState, "value", parseISODate(dateString));
    set(newState, 'touched', {month: true, day: true, year: true});

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        // console.log("Sending nothing")
        this.props.onChange();
      } else {
        // console.log("Sending", formatISOPartialDate(newState.value))
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    })
  }

  render() {
    const {id} = this.props;
    const {month, day, year} = this.state.value;
    const flatpickrDate = (month && day && year) ?
      formatISOPartialDate({month,day,year}) : undefined;

    //<span> state date: {formatISOPartialDate({month,day,year})} </span><br/>
    return (
      <div className="date-widget-container">

        <div className='date-widget-values-container'>
          <fieldset className='date-fieldset'>
            <div className="usa-date-of-birth">
              <div className="usa-datefield usa-form-group usa-form-group-month">
                <label className="input-date-label smaller-input" htmlFor={`${id}Month`}>Month</label>
                <input
                  className="usa-input-inline" id={`${id}Month`} name={`${id}Month`}
                  type="number" min="1" max="12" value={month}
                  onChange={(event) => this.handleFormChange('month', event.target.value)}
                />
              </div>
              <div className="usa-datefield usa-form-group usa-form-group-day">
                <label className="input-date-label smaller-input" htmlFor={`${id}Day`}>Day</label>
                <input
                  className="usa-input-inline" id={`${id}Day`} name={`${id}Day`}
                  type="number" min="1" max="31" value={day}
                  onChange={(event) => this.handleFormChange('day', event.target.value)}
                />
              </div>
              <div className="usa-datefield usa-form-group usa-form-group-year usa-form-group-year-fix">
                <label className="input-date-label smaller-input" htmlFor={`${id}Year`}>Year</label>
                <input
                  className="usa-input-inline" id={`${id}Year`} name={`${id}Year`}
                  type="number" min="1900" value={year}
                  onChange={(event) => this.handleFormChange('year', event.target.value)}
                />
              </div>
              <div className='usa-datefield usa-form-group flatpickr-container'>
                <Flatpickr
                  options={{
                    dateFormat: 'Y-m-d',
                    maxDate: 'today',
                    wrap: true,
                    allowInput: false,
                    enableTime: false,
                  }}
                  value={flatpickrDate}
                  onChange={(dates, datestring) => this.handleFlatpickrChange(datestring)}
                >
                  <input className={`hidden-flatpickr-input-box`} tabIndex="-1" type="text" data-input />
                  <span className="flatpickr-input-button usa-input-inline" title="toggle" data-toggle>
                    <i className="material-icons flatpickr-input-button">event</i>
                  </span>
                </Flatpickr>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }
}

DateWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
