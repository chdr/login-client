import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorMessage extends Component {
  render() {
    const { title, detail } = this.props;
    return (
      <div role="alert" className="mb-4">
        <div className="bg-red text-white font-bold rounded-t px-4 py-2">
          { title }
        </div>
        <div className="border border-t-0 border-red-light rounded-b bg-red-lightest px-4 py-3 text-red-dark">
          <p>{ detail }</p>
        </div>
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired
};

export default ErrorMessage;
