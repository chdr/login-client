import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import errorMessageFilter from '../../utility/error-message-filter';
import OAuthEmailConfirmation from './OAuthEmailConfirmation.Container';

class OAuthCallback extends Component {
  state = {
    hadError: false,
    emailList: [],
    errorTitle: '',
    errorDetail: ''
  };

  onError = (err) => {
    const { response } = err;
    const { errorDetail, errorTitle } = errorMessageFilter(response);

    this.setState({
      hadError: true,
      errorDetail,
      errorTitle
    });
  };

  onSuccess = (res) => {
    const { handleSuccessRedirect } = this.props;

    if (res.headers.location) {
      handleSuccessRedirect(res);
    } else {
      this.setState({
        emailList: res.data
      });
    }
  };

  call = ({
    search,
    authServer,
    handleSuccess
  }) => {
    axios.get(`${process.env.API_URL}/oauth/${authServer}-callback${search}`,
      { withCredentials: true })
      .then(this.onSuccess)
      .catch(this.onError);
  };

  componentDidMount() {
    const { location, match } = this.props;
    const { search } = location;
    const { authServer } = match.params;

    this.call({
      search,
      authServer
    });
  }

  render() {
    const { handleSuccessRedirect } = this.props;

    const {
      hadError,
      errorTitle,
      errorDetail,
      emailList
    } = this.state;

    if (hadError) {
      return (
        <Redirect
          to={{
            pathname: '/client',
            state: {
              errorTitle,
              errorDetail
            }
          }}
        />);
    }

    if (emailList.length) {
      return (
        <OAuthEmailConfirmation
          emails={emailList}
          handleSuccess={handleSuccessRedirect}
        />
      );
    }

    return (
      <p>
        Please wait...
      </p>
    );
  }
}

OAuthCallback.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      authServer: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  handleSuccessRedirect: PropTypes.func.isRequired
};

export default OAuthCallback;
