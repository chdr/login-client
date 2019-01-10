import React from 'react';
import PropTypes from 'prop-types';
import githubLogo from '../../img/github.svg';
import googleLogo from '../../img/google.svg';

import OAuthButton from './OAuthButton';

const OAuthButtons = ({ fwd }) => (
  <div className="OAuthButtons">
    <OAuthButton
      linkAppendedAs="github"
      name="GitHub"
      logoSrc={githubLogo}
      fwd={fwd}
    />
    <OAuthButton
      linkAppendedAs="google"
      name="Google"
      logoSrc={googleLogo}
      fwd={fwd}
    />
  </div>
);

OAuthButtons.propTypes = {
  fwd: PropTypes.string
};

export default OAuthButtons;
