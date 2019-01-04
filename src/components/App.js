import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import LoginContainer from './Login.Container';
import OAuthCallback from './OAuth/OAuthCallback';

class App extends Component {
  navigateToLocationHeader = ({ headers }) => {
    const { location } = headers;
    window.location.replace(location);
  }

  render() {
    return (
      <div className="app">
        <Route
          path="/client"
          exact
          render={routeProps => (
            <LoginContainer
              {...routeProps}
              handleSuccess={this.navigateToLocationHeader}
            />
          )}
        />
        <Route
          path="/client/:authServer"
          render={routeProps => (
            <OAuthCallback
              {...routeProps}
              handleSuccessRedirect={this.navigateToLocationHeader}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
