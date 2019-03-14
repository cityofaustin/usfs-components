import PropTypes from 'prop-types';
import React from 'react';
import Emoji from '../Emoji';
import Flatpickr from 'react-flatpickr';
import { set, cloneDeep } from 'lodash';

import {parseISODate, formatISOPartialDate} from './dateHelpers';

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
      invalidDate: false,
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
    return
      !month || !day || !year
  }

  handleFormChange(field, value) {
    let newState = cloneDeep(this.state);
    set(newState, ["value", field], value);
    set(newState, ['touched', field], true);
    console.log("Form new State", newState);

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        this.props.onChange();
      } else {
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    });
  }

  handleFlatpickrChange(dateString) {
    let newState = cloneDeep(this.state);
    set(newState, "value", parseISODate(dateString));
    set(newState, 'touched', {month: true, day: true, year: true});
    console.log("Flatpickr new State", newState);

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        this.props.onChange();
      } else {
        this.props.onChange(formatISOPartialDate(newState.value));
      }
    })
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
        <span> state date: {formatISOPartialDate({month,day,year})} </span><br/>

        <span className="usa-form-hint" id="dateHint">For example: 04 28 2018</span>
        <div className='date-widget-values-container'>
          <fieldset className='date-fieldset'>
            <div className="usa-date-of-birth">
              <div className="usa-datefield usa-form-group usa-form-group-month">
                <label className="input-date-label" htmlFor={`${id}Month`}>Month</label>
                <input
                  className="usa-input-inline" id={`${id}Month`} name={`${id}Month`}
                  type="number" min="1" max="12" value={month}
                  onChange={(event) => this.handleFormChange('month', event.target.value)}
                />
              </div>
              <div className="usa-datefield usa-form-group usa-form-group-day">
                <label className="input-date-label" htmlFor={`${id}Day`}>Day</label>
                <input
                  className="usa-input-inline" id={`${id}Day`} name={`${id}Day`}
                  type="number" min="1" max="31" value={day}
                  onChange={(event) => this.handleFormChange('day', event.target.value)}
                />
              </div>
              <div className="usa-datefield usa-form-group usa-form-group-year usa-form-group-year-fix">
                <label className="input-date-label" htmlFor={`${id}Year`}>Year</label>
                <input
                  className="usa-input-inline" id={`${id}Year`} name={`${id}Year`}
                  type="number" min="1900" value={year}
                  onChange={(event) => this.handleFormChange('year', event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <div className='flatpickr-container'>
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
              <span className="flatpickr-input-button" title="toggle" data-toggle>
                <Emoji symbol="📅" label="calendar"/>
              </span>
            </Flatpickr>
          </div>
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
