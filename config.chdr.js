const config = {
  url: {
    dev: {
      api: 'http://login.chdrdev.com:8888',
      marketing: 'http://www.chdrdev.com:8888'
    },
    prod: {
      api: 'http://login.chdrdev.com:8888',
      marketing: 'https://www.getcheddar.com'
    }
  },
  path: {
    docker: '../html/public/login',
    local: '../cheddar/public/login'
  }
};

module.exports = config;
