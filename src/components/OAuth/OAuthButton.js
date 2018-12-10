import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';

const OAuthButtons = ({ name, linkAppendedAs, logoSrc }) => (
  <a
    href={`${config.baseUri}/oauth/${linkAppendedAs}`}
    className="OAuthButton"
  >
    <button
      className="oauth"
      type="button"
    >
      <img src={logoSrc} alt={`Log in with ${name}`} />
      {`Log in with ${name}`}
    </button>
  </a>
);

OAuthButtons.propTypes = {
  name: PropTypes.string.isRequired,
  linkAppendedAs: PropTypes.string.isRequired,
  logoSrc: PropTypes.string.isRequired
};

export default OAuthButtons;
