import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';

const OAuthButtons = ({ name, linkAppendedAs, logoSrc }) => (
  <a
    href={`${config.baseUri}/oauth/${linkAppendedAs}`}
    className="text-grey-darkest no-underline flex-1 md:mx-2"
  >
    <button
      className="bg-grey-light hover:bg-grey-dark py-2 px-4 rounded w-full mb-3 md:mb-0"
      type="button"
    >
      <img src={logoSrc} className="float-left" alt={`Log in with ${name}`} />
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
