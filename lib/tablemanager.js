'use strict';

const async = require('async');

/*
handles checking and creation (if needed) of tables
*/
function tablemanager(options) {

    // store all the options for table names and such
    this.options = options;

    this.createTablesIfDoesntExist = createTablesIfDoesntExist;

    /*
    checks if each of the tables exist
    if they do not, create them
    callback is called with optional error
    */
    function createTablesIfDoesntExist(callback) {

        // create the tables if they do not exist
        async.parallel([
            createMetaTableIfDoesntExist,
            createBlobTableIfDoesntExist
        ],
        function(error) {
            callback(error);
        });
    }

    /*
    if successful callback is called with null
    otherwise it is called with error
    */
    function createBlobTableIfDoesntExist(callback) {

        // create statement if the table doesnt exist
        const createStatement = 'CREATE BLOB TABLE IF NOT EXISTS ' +
            this.options.blobTableName + ' clustered into ' +
            this.options.blobTableShards + ' shards,  with ' +
            '(number_of_replicas = ' + this.options.blobTableShards +
            ');'

        this.options.crate.execute(createStatement)
            .success(function(response) {
                callback(null);
            })
            .error(function(error) {
                callback(error);
            });
    }

    /*
    if successful callback is called with null
    otherwise it is called with error
    */
    function createMetaTableIfDoesntExist(callback) {

        // create statement if table doesnt exist
        const createStatement = 'CREATE TABLE IF NOT EXISTS ' +
            this.options.metaTableName + ' ( path string primary key, ' +
            'filename string, hash string, bytes integer ) clustered into ' +
            this.options.metaTableShards + ' shards with ' +
            '(number_of_replicas = ' + this.options.metaTableReplicas +
            ');'

        this.options.crate.execute(createStatement)
            .success(function(response) {
                callback(null);
            })
            .error(function(error) {
                callback(error);
            });
    }
}

module.exports = tablemanager;
