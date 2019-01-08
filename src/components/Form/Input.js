import React from 'react';
import PropTypes from 'prop-types';

const renderErrorMessages = errorMessages => errorMessages.map(errorMessage => (
  <div
    key={errorMessage}
    className="text-red text-xs my-1"
  >
    {errorMessage}
  </div>
));

const Input = ({
  htmlFor,
  label,
  value,
  checked,
  onChange,
  type,
  name,
  errors
}) => {
  if (type === 'checkbox') {
    return (
      <fieldset>
        <label htmlFor={htmlFor}>
          <input
            type={type}
            name={name}
            checked={checked}
            onChange={onChange}
          />
          { label }
        </label>
        { errors ? renderErrorMessages(errors) : null }
      </fieldset>
    );
  }

  if (type === 'radio') {
    return (
      <fieldset>
        <label htmlFor={htmlFor}>
          <input
            type={type}
            name={name}
            checked={checked}
            value={value}
            onChange={onChange}
            id={htmlFor}
          />
        <span>
          { label }
        </span>
        </label>
        { errors ? renderErrorMessages(errors) : null }
      </fieldset>
    );
  }

  return (
    <fieldset>
      <label htmlFor={htmlFor}>
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        name={name}
      />
      { errors ? renderErrorMessages(errors) : null }
    </fieldset>
  );
};

Input.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.array.isRequired
};

export default Input;
