const fs = require('fs');

// Read package.json file
const packageJson = require('../package.json');

// Copy dependencies object to build folder
fs.writeFileSync('./build/package.json', JSON.stringify({ dependencies: packageJson.dependencies }, null, 2));
