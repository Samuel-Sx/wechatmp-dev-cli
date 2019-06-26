const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '../../autoBuildConfig.json');
const jsonConfig = fs.readFileSync(configPath, 'utf-8');

module.exports = JSON.parse(jsonConfig);