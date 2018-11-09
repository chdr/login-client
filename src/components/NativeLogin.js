import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import config from '../config';

const renderErrorMessages = errorMessages => errorMessages.map(errorMessage => (
  <div
    key={errorMessage}
    className="text-red text-xs my-1"
  >
    {errorMessage}
  </div>
));

class NativeLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      id: '',
      password: '',
      idErrors: [],
      passwordErrors: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    const errorName = `${name}Errors`;

    this.setState({
      [name]: value,
      [errorName]: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { clearOnSubmit, onSubmitError, onSubmitSuccess } = this.props;
    const { id, password } = this.state;
    const values = {
      id,
      password
    };

    clearOnSubmit();

    this.setState({
      isSubmitting: true
    });

    axios({
      method: 'post',
      url: config.baseUri,
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
            passwordErrors: errors.password ? errors.password : ''
          });
        }
      });
  }

  render() {
    const {
      isSubmitting,
      id,
      password,
      idErrors,
      passwordErrors
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset className="mb-4">
          <label htmlFor="id" className="block mb-2">
            Email
          </label>
          <input
            value={id}
            onChange={this.handleInputChange}
            type="email"
            name="id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
          />
          { idErrors ? renderErrorMessages(idErrors) : null }
        </fieldset>
        <fieldset className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            value={password}
            onChange={this.handleInputChange}
            type="password"
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
          />
          { passwordErrors ? renderErrorMessages(passwordErrors) : null }
        </fieldset>
        <div className="flex justify-between flex-row">
          <fieldset className="mb-4">
            <label htmlFor="rememberMe">
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                name="rememberMe"
              />
              Remember me
            </label>
          </fieldset>
          <a className="text-green no-underline" href="http://unittest.cgdev.com/#forgot-password">Forgot your password?</a>
        </div>
        <button
          type="submit"
          className="bg-green hover:bg-green-dark text-white py-2 px-4 rounded w-full"
          disabled={isSubmitting}
        >
          Log in
        </button>
      </form>
    );
  }
}

NativeLogin.propTypes = {
  onSubmitError: PropTypes.func.isRequired,
  clearOnSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired
};

export default NativeLogin;
