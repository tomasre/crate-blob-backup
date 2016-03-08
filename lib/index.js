'use strict';

const fs = require('fs');

const Config = require('./config.js');
const Fswalker = require('./fswalker');

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

let fswalker;
try {
    fswalker = new Fswalker(config.options);
} catch (e) {
    console.log('crate-blob-backup error walking fs:');
    console.log(e);
    process.exit(1);
}

//console.log(config.options);
console.log(fswalker.files);
