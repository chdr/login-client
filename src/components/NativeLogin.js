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
        <fieldset>
          <label htmlFor="id">
            Email
          </label>
          <input
            value={id}
            onChange={this.handleInputChange}
            type="email"
            name="id"
          />
          { idErrors ? renderErrorMessages(idErrors) : null }
        </fieldset>
        <fieldset>
          <label htmlFor="password">
            Password
          </label>
          <input
            value={password}
            onChange={this.handleInputChange}
            type="password"
            name="password"
          />
          { passwordErrors ? renderErrorMessages(passwordErrors) : null }
        </fieldset>
        <div className="form-extras">
          <fieldset>
            <label htmlFor="rememberMe">
              <input
                type="checkbox"
                name="rememberMe"
              />
              Remember me
            </label>
          </fieldset>
          <a href={`${config.marketingLinkUri}/#forgot-password`}>
            Forgot your password?
          </a>
        </div>
        <button
          type="submit"
          className="primary"
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
