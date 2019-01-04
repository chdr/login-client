import React from 'react';

import logoCheddar from '../img/logo_cheddar.svg';

const Header = () => (
  <header>
    <a href={`${process.env.MARKETING_URL}`}>
      <img
        src={logoCheddar}
        alt="Cheddar logo"
      />
    </a>
  </header>
);

export default Header;
