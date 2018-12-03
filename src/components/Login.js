import React from 'react';
import PropTypes from 'prop-types';

import OAuthButtons from './OAuth/OAuthButtons';
import NativeLogin from './NativeLogin';
import ErrorMessage from './Alerts/ErrorMessage';

const Login = ({
  handleSuccess,
  handleError,
  handleSubmit,
  errorTitle,
  errorDetail
}) => (
  <div className="App font-sans h-screen h-full bg-grey-lightest">
    <div className="container mx-auto max-w-md md:flex md:justify-center md:flex-col h-full">
      {
        errorTitle && errorDetail
          ? (
            <ErrorMessage
              title={errorTitle}
              detail={errorDetail}
            />
          ) : null
      }
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-8 md:mt-0 mx-2 md:mx-0">
        <OAuthButtons />
        <div className="divider flex justify-center items-center my-4">
          <span className="px-4 text-grey-darker">or</span>
        </div>
        <NativeLogin
          onSubmitError={handleError}
          onSubmitSuccess={handleSuccess}
          clearOnSubmit={handleSubmit}
        />
        <div className="text-center mt-6">
          Don&apos;t have an account?
          <a href="http://www.chdrdev.com:8888/signup">
            <button
              type="button"
              className="bg-transparent hover:bg-green text-green-dark hover:text-white py-2 px-4 border border-green hover:border-transparent rounded ml-3"
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
