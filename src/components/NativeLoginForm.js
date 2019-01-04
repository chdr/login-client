import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Input from './Form/Input';

const NativeLoginForm = ({
  isSubmitting,
  id,
  password,
  rememberMe,
  idErrors,
  passwordErrors,
  rememberMeErrors,
  handleSubmit,
  handleInputChange
}) => (
  <form onSubmit={handleSubmit}>
    <Input
      htmlFor="id"
      label="Email"
      value={id}
      onChange={handleInputChange}
      type="email"
      name="id"
      errors={idErrors}
    />
    <Input
      htmlFor="password"
      label="Password"
      value={password}
      onChange={handleInputChange}
      type="password"
      name="password"
      errors={passwordErrors}
    />
    <div className="form-extras">
      <Input
        htmlFor="rememberMe"
        label="Remember me"
        checked={rememberMe}
        onChange={handleInputChange}
        type="checkbox"
        name="rememberMe"
        errors={rememberMeErrors}
      />
      <a href={`${process.env.MARKETING_URL}/#forgot-password`}>
        Forgot your password?
      </a>
    </div>
    <button
      type="submit"
      className="primary"
      disabled={isSubmitting}
    >
      Log in
    </button>
  </form>
);

NativeLoginForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  rememberMe: PropTypes.bool.isRequired,
  idErrors: PropTypes.array.isRequired,
  passwordErrors: PropTypes.array.isRequired,
  rememberMeErrors: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default NativeLoginForm;
