import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import LoginContainer from './Login.Container';
import OAuthCallback from './OAuth/OAuthCallback';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleSuccess = this.handleSuccess.bind(this);
  }

  handleSuccess(res) {
    window.location.replace('http://www.chdrdev.com:8888/admin/dashboard/');
  }

  render() {
    return (
      <div>
        <Route
          path="/client"
          exact
          render={routeProps => (
            <LoginContainer
              {...routeProps}
              handleSuccess={this.handleSuccess}
            />
          )}
        />
        <Route
          path="/client/:authServer"
          render={routeProps => (
            <OAuthCallback
              {...routeProps}
              handleSuccess={this.handleSuccess}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
