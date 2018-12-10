import React from 'react';
import PropTypes from 'prop-types';

import OAuthButtons from './OAuth/OAuthButtons';
import NativeLogin from './NativeLogin';
import ErrorMessage from './Alerts/ErrorMessage';
import config from '../config';

import logoCheddar from '../img/logo_cheddar.svg';

const Login = ({
  handleSuccess,
  handleError,
  handleSubmit,
  errorTitle,
  errorDetail
}) => (
  <div className="App">
    <div className="container">
      <header>
        <a href="#">
          <img
            src={logoCheddar}
            alt="Cheddar logo"
          />
        </a>
      </header>
      {
        errorTitle && errorDetail
          ? (
            <ErrorMessage
              title={errorTitle}
              detail={errorDetail}
            />
          ) : null
      }
      <div className="login-card">
        <OAuthButtons />
        <div className="divider">
          <span>or</span>
        </div>
        <NativeLogin
          onSubmitError={handleError}
          onSubmitSuccess={handleSuccess}
          clearOnSubmit={handleSubmit}
        />
        <div className="text-center mt-6">
          Don&apos;t have an account?
          <a href={`${config.marketingLinkUri}/signup`}>
            <button
              type="button"
              className="alt"
            >
              Sign up
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
);

Login.propTypes = {
  handleSuccess: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorTitle: PropTypes.string.isRequired,
  errorDetail: PropTypes.string.isRequired
};

export default Login;
