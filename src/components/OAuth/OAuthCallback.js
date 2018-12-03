import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import errorMessageFilter from '../../utility/error-message-filter';
import config from '../../config';

class OAuthCallback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hadError: false,
      errorTitle: '',
      errorDetail: ''
    };

    this.call = this.call.bind(this);
  }

  componentDidMount() {
    const {
      location,
      match,
      handleSuccess
    } = this.props;
    const { search } = location;
    const { authServer } = match.params;

    this.call({
      search,
      authServer,
      handleSuccess
    });
  }

  call({
    search,
    authServer,
    handleSuccess
  }) {
    axios.get(`${config.baseUri}/oauth/${authServer}-callback${search}`,
      { withCredentials: true })
      .then((res) => {
        handleSuccess(res);
      })
      .catch((err) => {
        const { response } = err;
        const { errorDetail, errorTitle } = errorMessageFilter(response);
        this.setState({
          hadError: true,
          errorDetail,
          errorTitle
        });
      });
  }

  render() {
    const {
      hadError,
      errorTitle,
      errorDetail
    } = this.state;

    if (hadError) {
      return (
        <Redirect
          to={{
            pathname: '/',
            state: {
              errorTitle,
              errorDetail
            }
          }}
        />);
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
  handleSuccess: PropTypes.func.isRequired
};

export default OAuthCallback;
