import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import NativeLoginForm from './NativeLoginForm';

class NativeLoginFormContainer extends React.Component {
  state = {
    isSubmitting: false,
    id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    password: '',
    rememberMe: localStorage.getItem('rememberMe') === 'true',
    idErrors: [],
    passwordErrors: [],
    rememberMeErrors: []
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

    const { clearOnSubmit, onSubmitError, onSubmitSuccess } = this.props;
    const { id, password, rememberMe } = this.state;
    const values = {
      id,
      password,
      rememberMe
    };

    clearOnSubmit();

    this.setState({
      isSubmitting: true
    });

    values.rememberMe = 'false';

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

        this.setLocalStorage(values);

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
            idErrors: errors.id ? errors.id : [],
            passwordErrors: errors.password ? errors.password : [],
            rememberMeErrors: errors.rememberMe ? errors.rememberMe : []
          });
        }
      });
  }

  setLocalStorage = ({rememberMe, id}) => {
    if (rememberMe) {
      localStorage.setItem('rememberMe', rememberMe);
      localStorage.setItem('id', id);
    } else {
      localStorage.clear();
    }
  }

  render() {
    const {
      isSubmitting,
      id,
      password,
      rememberMe,
      idErrors,
      passwordErrors,
      rememberMeErrors
    } = this.state;

    return (
      <NativeLoginForm
        isSubmitting={isSubmitting}
        id={id}
        password={password}
        rememberMe={rememberMe}
        idErrors={idErrors}
        passwordErrors={passwordErrors}
        rememberMeErrors={rememberMeErrors}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

NativeLoginFormContainer.propTypes = {
  onSubmitError: PropTypes.func.isRequired,
  clearOnSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired
};

export default NativeLoginFormContainer;
