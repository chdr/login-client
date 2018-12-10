import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ title, detail }) => (
  <div role="alert">
    <div className="title">
      { title }
    </div>
    <div className="detail">
      <p>{ detail }</p>
    </div>
  </div>
);

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired
};

export default ErrorMessage;
