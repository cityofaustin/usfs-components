import PropTypes from 'prop-types';
import React from 'react';
import { set, cloneDeep } from 'lodash';

import {formatHourMinute, parseTime, formatTime} from './timeHelpers';

import '../DateWidget/DateWidget.css';

// Returns datestring in the form "2011-11-11"
// Uses parts of us-form-system's DateWidget. Includes a Calendar date picker.
// ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx
export default class TimeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: parseTime(this.props.value),
      touched: {
        hour: false,
        minute: false,
      },
    }
    this.onChange = this.onChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  onChange({ dates, datestring }) {
    this.props.onChange(datestring);
  }

  isIncomplete({hour, minute}) {
    return
      !hour || (!minute && !minute.length)
  }

  handleFormChange(field, value) {
    let newState = cloneDeep(this.state);
    set(newState, ["value", field], value);
    set(newState, ['touched', field], true);
    console.log("Form new State", newState);

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        console.log("Sending nothing")
        this.props.onChange();
      } else {
        console.log("Sending", formatTime(newState.value))
        this.props.onChange(formatTime(newState.value));
      }
    });
  }

  render() {
    const {id} = this.props;
    const {hour,minute,period} = this.state.value;

    return (
      <div className="time-widget-container">
        <span> state time: {formatTime({hour,minute,period})} </span><br/>

        <span className="usa-form-hint" id="timeHint">For example: 12:30 AM</span>
        <div className='time-widget-values-container'>
          <fieldset className='date-fieldset'>
            <div className="usa-datefield usa-form-group usa-form-group-day">
              <label className="input-date-label" htmlFor={`${id}Hour`}>Hour</label>
              <input
                className="usa-input-inline" id={`${id}Hour`} name={`${id}Hour`}
                type="number" min="1" max="12" value={hour}
                onChange={(event) => this.handleFormChange('hour', event.target.value)}
              />
            </div>
            <div className="usa-datefield usa-form-group usa-form-group-day">
              <label className="input-date-label" htmlFor={`${id}Minute`}>Minute</label>
              <input
                className="usa-input-inline" id={`${id}Minute`} name={`${id}Minute`}
                type="number" min="0" max="60" value={minute}
                onChange={(event) => this.handleFormChange('minute', event.target.value)}
              />
            </div>
          </fieldset>
          <div className="time-period-select-container">
            <select className="date-fieldset" name={`${id}am_pm_period`} id={`${id}am_pm_period`}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

TimeWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
