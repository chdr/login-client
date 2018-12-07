const fs = require('fs-extra');

fs.remove('../cheddar/public/login/build')
  .then(() => {
    fs.copy('./build', '../cheddar/public/login/build');
  })
  .catch(err => {
    console.error(err);
  });
