#!/usr/bin/env node

const commander = require('../utils/clicommander');
const runtime = require('./open');
const uploadBuild = require('./upload')

if (commander.start) {
    runtime();
}
if (commander.upload) {
    uploadBuild();
}