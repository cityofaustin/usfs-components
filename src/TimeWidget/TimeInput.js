import React from 'react';
import PropTypes from 'prop-types';

export default function TimeInput(props) {
  let {type} = props;
  const {id, onChange, value} = props;

  type = type.substring(2); // Hotfix to allow translation script to work. Gets rid of __ prefix

  return (
    <div className="usa-datefield usa-form-group usa-form-group-day">
      <label className="input-date-label smaller-input" htmlFor={id + '_' + type}>{type}</label>
      <input
        className="usa-input-inline" id={id + '_' + type} name={id + '_' + type}
        type="number" step="1" pattern="^\d+$" min="0" max="60" value={value}
        onChange={(event) => onChange(type.toLowerCase(), event.target.value)}
      />
    </div>
  )
}

TimeInput.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired, // "Hour" or "Minute"
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
