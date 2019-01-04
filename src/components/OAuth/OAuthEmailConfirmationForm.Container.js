import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Input from '../Form/Input';
import OAuthEmailConfirmationForm from './OAuthEmailConfirmationForm';

class OAuthEmailConfirmationContainer extends React.Component {
  state = {
    id: this.props.emails[0],
    password: '',
    idErrors: [],
    passwordErrors: [],
    isSubmitting: false
  };

  handleInputChange = (event) => {
    const { target } = event;
    const { name, type } = target;

    const value = type === 'checkbox' ? target.checked : target.value;

    const errorName = `${name}Errors`;

    this.setState({
      [name]: value,
      [errorName]: []
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const {
      clearOnSubmit,
      onSubmitError,
      onSubmitSuccess
    } = this.props;

    const {
      id,
      password,
      rememberMe
    } = this.state;

    const values = {
      id,
      password,
      rememberMe
    };

    clearOnSubmit();

    this.setState({
      isSubmitting: true
    });

    axios({
      method: 'post',
      url: process.env.API_URL,
      data: values,
      withCredentials: true
    })
      .then((res) => {
        this.setState({
          isSubmitting: false
        });

        onSubmitSuccess(res);
      })
      .catch((err) => {
        this.setState({
          isSubmitting: false
        });

        onSubmitError(err);

        if (
          err.response
          && err.response.status === 412
        ) {
          const { parameters } = err.response.data;
          const errors = Object.keys(parameters)
            .reduce((acc, fieldName) => {
              acc[fieldName] = [];
              Object.keys(parameters[fieldName]).forEach((failedValidationKey) => {
                acc[fieldName].push(parameters[fieldName][failedValidationKey]);
              });
              return acc;
            }, {});
          this.setState({
            idErrors: errors.id ? errors.id : '',
            passwordErrors: errors.password ? errors.password : '',
            rememberMeErrors: errors.rememberMe ? errors.rememberMe : ''
          });
        }
      });
  };

  render() {
    const { emails } = this.props;

    const {
      isSubmitting,
      id,
      password,
      idErrors,
      passwordErrors
    } = this.state;

    return (
      <OAuthEmailConfirmationForm
        emails={emails}
        isSubmitting={isSubmitting}
        id={id}
        password={password}
        idErrors={idErrors}
        passwordErrors={passwordErrors}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

OAuthEmailConfirmationContainer.propTypes = {
  emails: PropTypes.array.isRequired,
  onSubmitError: PropTypes.func.isRequired,
  clearOnSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired
};

export default OAuthEmailConfirmationContainer;
