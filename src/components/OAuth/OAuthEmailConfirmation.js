import React from 'react';
import PropTypes from 'prop-types';

import OAuthEmailConfirmationForm from './OAuthEmailConfirmationForm.Container';
import Header from '../Header';
import ErrorMessage from '../Alerts/ErrorMessage';

const OAuthEmailConfirmation = ({
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
            Confirm your account
          </h2>
          <hr className="green-divider" />
        </div>
        <p>
          Great! Just confirm that you'd like to link these credentials to
          Cheddar. You won't need to do this again.
        </p>
        <OAuthEmailConfirmationForm
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
  handleSuccess: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  emails: PropTypes.array.isRequired,
  errorTitle: PropTypes.string.isRequired,
  errorDetail: PropTypes.string.isRequired
};

export default OAuthEmailConfirmation;
