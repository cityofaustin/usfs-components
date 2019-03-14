import PropTypes from 'prop-types';
import React from 'react';
import { set, cloneDeep } from 'lodash';

import TimeInput from './TimeInput.js';
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
    // Only allow integer values
    if ((value !== "") && (!/^\d+$/.test(value)) && (value.length <= 2)) {
      return
    }
    if (field === "hour") {
      if (value > 12) {
        return
      }
      if (value < 1) {
        value = "";
      }
    }
    if (field === "minute") {
      if ((value > 59) || (value < 0)) {
        return
      }
    }

    let newState = cloneDeep(this.state);
    set(newState, ["value", field], formatHourMinute(value));
    set(newState, ['touched', field], true);
    if ((field === "hour") && (this.state.value.minute === "")) {
      set(newState, ['value', "minute"], "00");
    }

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
        <div className='time-widget-values-container'>
          <fieldset className='date-fieldset'>
            <TimeInput
              id={id}
              type={"Hour"}
              onChange={this.handleFormChange}
              value={hour}
            />
            <TimeInput
              id={id}
              type={"Minute"}
              onChange={this.handleFormChange}
              value={minute}
            />
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
