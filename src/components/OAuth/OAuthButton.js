import React from 'react';
import PropTypes from 'prop-types';

const OAuthButtons = ({ name, linkAppendedAs, logoSrc, fwd }) => {
  const link = fwd
    ? `${process.env.API_URL}/oauth/${linkAppendedAs}?fwd=${fwd}`
    : `${process.env.API_URL}/oauth/${linkAppendedAs}`;
  return (
    <a
      href={link}
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
};

OAuthButtons.propTypes = {
  name: PropTypes.string.isRequired,
  linkAppendedAs: PropTypes.string.isRequired,
  logoSrc: PropTypes.string.isRequired,
  fwd: PropTypes.string
};

export default OAuthButtons;
