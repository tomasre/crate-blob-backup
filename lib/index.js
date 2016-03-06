'use strict';

const fs = require('fs');

const Config = require('./config.js');

if (process.argv.length < 3) {
    console.log('Error: must pass in path to config file.  Exiting...');
    process.exit(1);
}

/*
try to create a new config from config file
 */
let config;
try {
    config = new Config(process.argv[2]);
} catch (e) {
    console.log('crate-blob-backup error parsing config:');
    console.log(e);
    process.exit(1);
}

console.log(config.options);
