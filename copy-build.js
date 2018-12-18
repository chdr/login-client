const fs = require('fs-extra');
const config = require('./config.chdr');

const path = process.argv[2] === 'true'
  ? config.path.development.active
  : config.path.production;

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
