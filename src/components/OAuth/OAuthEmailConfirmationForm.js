import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import Input from '../Form/Input';

const OAuthEmailConfirmationForm = ({
    emails,
    isSubmitting,
    id,
    password,
    idErrors,
    passwordErrors,
    handleSubmit,
    handleInputChange,
    authServer,
  }) => (
    <form onSubmit={handleSubmit}>
      <div className="radio-group">
        {
          emails.map(email => (
            <Input
              key={email}
              htmlFor={email}
              label={email}
              value={email}
              onChange={handleInputChange}
              checked={email === id}
              type="radio"
              name="id"
              errors={idErrors}
            />
          ))
        }
      </div>
      <Input
        htmlFor="password"
        label="Password"
        value={password}
        onChange={handleInputChange}
        type="password"
        name="password"
        errors={passwordErrors}
        placeholder='Cheddar password'
      />
      <button
        type="submit"
        className="primary"
        disabled={isSubmitting}
      >
        Link your account
      </button>
      <a href={`${process.env.MARKETING_URL}/#forgot-password`}>
        Forgot your password?
      </a>
    </form>
);

OAuthEmailConfirmationForm.propTypes = {
  emails: PropTypes.array.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  idErrors: PropTypes.array.isRequired,
  passwordErrors: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default OAuthEmailConfirmationForm;
