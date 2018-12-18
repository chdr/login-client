const config = {
  url: {
    dev: {
      api: 'http://login.chdrdev.com:8888',
      marketing: 'http://www.chdrdev.com:8888'
    },
    prod: {
      api: 'https://login.getcheddar.com',
      marketing: 'https://www.getcheddar.com'
    }
  },
  path: {
    production: '../../../public/login',
    development: {
      static: '../../../public/login',
      active: '../cheddar/public/login'
    }
  }
};

module.exports = config;
