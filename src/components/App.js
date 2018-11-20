import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import OAuthButtons from './OAuth/OAuthButtons';
import NativeLogin from './NativeLogin';
import OAuthCallback from './OAuth/OAuthCallback';
import ErrorMessage from './Alerts/ErrorMessage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorTitle: '',
      errorDetail: ''
    };

    this.handleError = this.handleError.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.errorMessageReducer = this.errorMessageReducer.bind(this);
  }

  errorMessageReducer(response) {
    const { status } = response;
    switch (status) {
      case 401: {
        this.setState({
          errorTitle: 'Login-in failed',
          errorDetail: 'The email address and password you entered did not match our records.'
        });
        break;
      }
      default: {
        this.setState({
          errorTitle: response.data.title,
          errorDetail: response.data.detail
        });
        break;
      }
    }
  }

  handleSubmit() {
    this.setState({
      errorTitle: '',
      errorDetail: ''
    });
  }

  handleSuccess(res) {
    window.location.replace('http://www.chdrdev.com:8888/admin/dashboard/');
  }

  handleError(err) {
    const { response, request } = err;
    // the request was made but no response was received
    if (!response && request) {}
    // something happened in setting up the request that triggered an error
    if (!response && !request) {}
    // proceed with the "normal" case of a "normal" error
    this.errorMessageReducer(response);
  }

  render() {
    const { errorTitle, errorDetail } = this.state;
    return (
      <div className="App font-sans h-screen h-full bg-grey-lightest">
        <div className="container mx-auto max-w-md md:flex md:justify-center md:flex-col h-full">
          {
            errorTitle && errorDetail
              ? (
                <ErrorMessage
                  title={errorTitle}
                  detail={errorDetail}
                />
              ) : null
          }
          <Route
            path="/login/:authServer"
            render={
              props => (
                <OAuthCallback
                  {...props}
                  onError={this.handleError}
                  onSuccess={this.handleSuccess}
                />
              )
            }
          />
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-8 md:mt-0 mx-2 md:mx-0">
            <OAuthButtons />
            <div className="divider flex justify-center items-center my-4">
              <span className="px-4 text-grey-darker">or</span>
            </div>
            <NativeLogin
              onSubmitError={this.handleError}
              onSubmitSuccess={this.handleSuccess}
              clearOnSubmit={this.handleSubmit}
            />
            <div className="text-center mt-6">
              Don&apos;t have an account?
              <a href="http://unittest.cgdev.com/signup">
                <button
                  type="button"
                  className="bg-transparent hover:bg-green text-green-dark hover:text-white py-2 px-4 border border-green hover:border-transparent rounded ml-3">
                  Sign up
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
