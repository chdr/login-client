import React from 'react';
import PropTypes from 'prop-types';

import OAuthButtons from './OAuth/OAuthButtons';
import NativeLoginForm from './NativeLoginForm.Container';
import ErrorMessage from './Alerts/ErrorMessage';
import Header from './Header';

const Login = ({
  handleSuccess,
  handleError,
  handleSubmit,
  errorTitle,
  errorDetail
}) => (
  <div className="page">
    <div className="container">
      <Header />
      {
        errorTitle && errorDetail
          ? (
            <ErrorMessage
              title={errorTitle}
              detail={errorDetail}
            />
          ) : null
      }
      <div className="card">
        <OAuthButtons />
        <div className="divider">
          <span>or</span>
        </div>
        <NativeLoginForm
          onSubmitError={handleError}
          onSubmitSuccess={handleSuccess}
          clearOnSubmit={handleSubmit}
        />
        <div className="text-center mt-6">
          Don&apos;t have an account?
          <a href={`${process.env.MARKETING_URL}/signup`}>
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
