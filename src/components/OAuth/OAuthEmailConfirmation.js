import React from 'react';
import PropTypes from 'prop-types';

import OAuthEmailConfirmationForm from './OAuthEmailConfirmationForm.Container';
import Header from '../Header';
import ErrorMessage from '../Alerts/ErrorMessage';

const messages = {
  google: 'Great! We found an account at Cheddar that matches the email address you chose at Google! Please enter your Cheddar password to link it to your Google account.',
  github: 'Great! We found an account at Cheddar that matches an email address from GitHub! Please enter your Cheddar password to link it to your GitHub account.'
};

const OAuthEmailConfirmation = ({
  authServer,
  emails,
  errorTitle,
  errorDetail,
  handleSubmit,
  handleError,
  handleSuccess
}) => (
  <div className="page OAuthEmailConfirmation">
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
        <div className="card-header">
          <h2>
            Link your {authServer === 'github' ? 'GitHub' : 'Google'} account
          </h2>
          <hr className="green-divider" />
        </div>
        <p>
          {messages[authServer]}
        </p>
        <OAuthEmailConfirmationForm
          authServer={authServer}
          emails={emails}
          clearOnSubmit={handleSubmit}
          onSubmitError={handleError}
          onSubmitSuccess={handleSuccess}
        />
      </div>
    </div>
  </div>
);

OAuthEmailConfirmation.propTypes = {
  authServer: PropTypes.string.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  emails: PropTypes.array.isRequired,
  errorTitle: PropTypes.string.isRequired,
  errorDetail: PropTypes.string.isRequired
};

export default OAuthEmailConfirmation;
