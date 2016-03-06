'use strict';

const fs = require('fs');

/*
config file format: {
    hosts: [
        'http://localhost:4250',
        ...
    ],
    backupPath: 'path/to/dir/to/backup',
    createMetaTable: true,
    metaTableName: '...',
    metaTableReplicas: 2,
    metaTableShards: 3,
    createBlobTable: true,
    blobTableName: '...',
    blobTableReplicas: 1,
    blobTableShards: 3
}
 */

/*
the defaults for the optional options
 */
const DEFAULT_OPTIONS = {
    metaTableReplicas: 2,
    metaTableShards: 3,
    blobTableReplicas: 1,
    blobTableShards: 3
};

/*
if configFile does not exist, will throw an exception
uses sync fs.readFileSync to read config file
 */
function config(configFile) {

    const fileData = fs.readFileSync(configFile);
    this.options = JSON.parse(fileData);

    // throw an exception if any of the required options are missing
    if (!this.options.hosts) {
        throw "crate-blob-backup options.hosts missing";
    }

    if (!this.options.backupPath) {
        throw "crate-blob-backup options.backupPath missing";
    }

    if (!this.options.createMetaTable) {
        throw "crate-blob-backup options.createMetaTable missing";
    }

    if (!this.options.createBlobTable) {
        throw "crate-blob-backup options.createBlobTable missing";
    }

    if (!this.options.metaTableName) {
        throw "crate-blob-backup options.metaTableName missing";
    }

    if (!this.options.blobTableName) {
        throw "crate-blob-backup options.createBlobTable missing";
    }

    // add in the defaults for the options if they don't exist
    if (!this.options.metaTableReplicas) {
        this.options.metaTableReplicas = DEFAULT_OPTIONS.metaTableReplicas;
    }

    if (!this.options.metaTableShards) {
        this.options.metaTableShards = DEFAULT_OPTIONS.metaTableShards;
    }

    if (!this.options.blobTableReplicas) {
        this.options.blobTableReplicas = DEFAULT_OPTIONS.blobTableReplicas;
    }

    if (!this.options.blobTableShards) {
        this.options.blobTableShards = DEFAULT_OPTIONS.blobTableShards;
    }
}

module.exports = config;