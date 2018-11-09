import React from 'react';
import githubLogo from '../../img/github.svg';
import googleLogo from '../../img/google.svg';

import OAuthButton from './OAuthButton';

export default () => (
  <div className="mb-0 md:flex md:-mx-2 md:mb-6">
    <OAuthButton linkAppendedAs="github" name="GitHub" logoSrc={githubLogo} />
    <OAuthButton linkAppendedAs="google" name="Google" logoSrc={googleLogo} />
  </div>
);
