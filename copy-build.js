const fs = require('fs-extra');

const path = process.argv[2] === 'true'
  ? '../html/public/login'
  : '../cheddar/public/login';

copyBuild(path);

function copyBuild(relativeDestinationPath) {
  fs.remove(relativeDestinationPath)
    .then(() => {
      fs.copy('./build', relativeDestinationPath);
    })
    .catch(err => {
      console.error(err);
    });
}
