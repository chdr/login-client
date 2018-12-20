import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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

    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const id = localStorage.getItem('id') ? localStorage.getItem('id') : '';

    this.state = {
      isSubmitting: false,
      id,
      password: '',
      rememberMe,
      idErrors: [],
      passwordErrors: [],
      rememberMeErrors: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setLocalStorage = this.setLocalStorage.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type } = target;

    const value = type === 'checkbox' ? target.checked : target.value;

    const errorName = `${name}Errors`;

    this.setState({
      [name]: value,
      [errorName]: ''
    });
  }

  handleSubmit(event) {
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
            idErrors: errors.id ? errors.id : '',
            passwordErrors: errors.password ? errors.password : '',
            rememberMeErrors: errors.rememberMe ? errors.rememberMe : ''
          });
        }
      });
  }

  setLocalStorage({rememberMe, id}) {
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
                checked={rememberMe}
                onChange={this.handleInputChange}
              />
              Remember me
            </label>
            { rememberMeErrors ? renderErrorMessages(rememberMeErrors) : null }
          </fieldset>
          <a href={`${process.env.MARKETING_URL}/#forgot-password`}>
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
