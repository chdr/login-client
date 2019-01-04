import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Login from './Login';
import errorMessageFilter from '../utility/error-message-filter';

class LoginContainer extends Component {
  state = {
    errorTitle: '',
    errorDetail: ''
  };

  componentDidMount() {
    const { location, history } = this.props;
    const { state } = location;

    if (state !== undefined) {
      const { errorDetail, errorTitle } = state;
      this.setState({
        errorDetail,
        errorTitle
      });
      const stateFreeLocation = Object.assign(
        {},
        location,
        {
          state: {
            errorDetail: '',
            errorTitle: ''
          }
        }
      );
      history.replace(stateFreeLocation);
    }
  }

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
    const { handleSuccess } = this.props;

    return (
      <Login
        handleError={this.handleError}
        handleSuccess={handleSuccess}
        handleSubmit={this.handleSubmit}
        errorTitle={errorTitle}
        errorDetail={errorDetail}
      />
    );
  }
}

LoginContainer.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      errorTitle: PropTypes.string,
      errorDetail: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.object.isRequired,
  handleSuccess: PropTypes.func.isRequired
};

export default withRouter(LoginContainer);
