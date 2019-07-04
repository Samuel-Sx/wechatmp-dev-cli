#!/usr/bin/env node

const commander = require('../utils/clicommander');
const runtime = require('./open');
const uploadBuild = require('./upload')
const injectRedux = require('../redux/index');
if (commander.start) {
    runtime();
}
if (commander.upload) {
    uploadBuild();
}
if (commander.use) {
    if (commander.use === 'redux') {
        injectRedux();
    } else {
        return console.log(`No supported modules`);
    }
}