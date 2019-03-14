import PropTypes from 'prop-types';
import React from 'react';
import Emoji from '../Emoji';
import Flatpickr from 'react-flatpickr';
import set from 'lodash';

import {parseISODate, formatISOPartialDate} from './dateHelpers';

import 'flatpickr/dist/themes/material_green.css';
import './DateWidget.css';

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
    let newState = set(['value', field], value, this.state);
    newState = set(['touched', field], true, newState);

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        this.props.onChange();
      } else {
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    });
  }

  render() {
    const {id} = this.props;
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
        <span> hiiiii {formatISOPartialDate({month,day,year})} </span>

        <form>
          <fieldset>
            <span className="usa-form-hint" id="dateHint">For example: 04 28 2018</span>
            <div className="usa-date-of-birth">
              <div className="usa-datefield usa-form-group usa-form-group-month">
                <label className="input-date-label" htmlFor={`${id}Month`}>Month</label>
                <input
                  className="usa-input-inline" id={`${id}Month`} name={`${id}Month`}
                  type="number" min="1" max="12" value={month}
                  onChange={(event) => this.handleChange('month', event.target.value)}
                />
              </div>
              <div className="usa-datefield usa-form-group usa-form-group-day">
                <label className="input-date-label" htmlFor={`${id}Day`}>Day</label>
                <input
                  className="usa-input-inline" id={`${id}Day`} name={`${id}Day`}
                  type="number" min="1" max="31" value={day}
                  onChange={(event) => this.handleChange('day', event.target.value)}
                />
              </div>
              <div className="usa-datefield usa-form-group usa-form-group-year">
                <label className="input-date-label" htmlFor={`${id}Year`}>Year</label>
                <input
                  className="usa-input-inline" id={`${id}Year`} name={`${id}Year`}
                  type="number" min="1900" value={year}
                  onChange={(event) => this.handleChange('year', event.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </form>

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

/**
<div className="usa-date-of-birth row">
  <div className="form-datefield-month">
    <label className="input-date-label" htmlFor={`${id}Month`}>Month</label>
    <select
      name={`${id}Month`}
      id={`${id}Month`}
      value={month}
      onChange={(event) => this.handleChange('month', event.target.value)}>
      <option value=""/>
      {months.map(mnth => <option key={mnth.value} value={mnth.value}>{mnth.label}</option>)}
    </select>
  </div>
  {!monthYear && <div className="form-datefield-day">
    <label className="input-date-label" htmlFor={`${id}Day`}>Day</label>
    <select
      name={`${id}Day`}
      id={`${id}Day`}
      value={day}
      onChange={(event) => this.handleChange('day', event.target.value)}>
      <option value=""/>
      {daysForSelectedMonth && daysForSelectedMonth.map(dayOpt => <option key={dayOpt} value={dayOpt}>{dayOpt}</option>)}
    </select>
  </div>}
  <div className="usa-datefield usa-form-group usa-form-group-year">
    <label className="input-date-label" htmlFor={`${id}Year`}>Year</label>
    <input type="number"
      autoComplete={options.autocomplete}
      name={`${id}Year`}
      id={`${id}Year`}
      max="3000"
      min="1900"
      pattern="[0-9]{4}"
      value={year}
      onBlur={() => this.handleBlur('year')}
      onChange={(event) => this.handleChange('year', event.target.value)}/>
  </div>
</div>
**/

DateWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
