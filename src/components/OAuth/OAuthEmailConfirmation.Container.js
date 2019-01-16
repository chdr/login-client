import React from 'react';
import PropTypes from 'prop-types';

import OAuthEmailConfirmation from './OAuthEmailConfirmation';
import Header from '../Header';
import ErrorMessage from '../Alerts/ErrorMessage';
import errorMessageFilter from '../../utility/error-message-filter';

class OAuthEmailConfirmationContainer extends React.Component {
  state = {
    errorTitle: '',
    errorDetail: ''
  };

  handleSubmit = () => {
    this.setState({
      errorTitle: '',
      errorDetail: ''
    });
  }

  handleError = (err) => {
    const { response, request } = err;
    // the request was made but no response was received
    if (!response && request) {}
    // something happened in setting up the request that triggered an error
    if (!response && !request) {}
    // proceed with the "normal" case of a "normal" error
    const { errorTitle, errorDetail } = errorMessageFilter(response);

    this.setState({
      errorTitle,
      errorDetail
    });
  }

  render() {
    const { errorTitle, errorDetail } = this.state;
    const { emails, handleSuccess, authServer } = this.props;

    return (
      <OAuthEmailConfirmation
        authServer={authServer}
        emails={emails}
        errorTitle={errorTitle}
        errorDetail={errorDetail}
        handleError={this.handleError}
        handleSuccess={handleSuccess}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

OAuthEmailConfirmation.propTypes = {
  authServer: PropTypes.string.isRequired,
  emails: PropTypes.array.isRequired,
  handleSuccess: PropTypes.func.isRequired
};

export default OAuthEmailConfirmationContainer;
