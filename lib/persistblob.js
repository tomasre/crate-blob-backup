'use strict';

const async = require('async');
const fs = require('fs');
const path = require('path');

/*
persists a single file to the database

persistBlob is new'd with the options object
NOTE: if blob table stores for example and meta entry requests fails, will not
delete the blob table entry

has a member function called persistFile which takes:
a path to a file to persist
a callback

callback is called with:
error if one occurred
stats if an error did not occur

stats is an object with the parameters:
start: date when the request started
milliseconds: high resolution time to persistance in milliseconds
bytes: size in bytes of the persisted file
path: filepath
NOTE: fs.stat async for size, and storing the blob are executed in series so for
measuring how fast individual ones are stored this will not be accurrate but will
remain accurate for throughput
*/
function persistBlob(options) {

    // store the meta table name
    this.metaTableName = options.metaTableName;

    // store the blob table name
    this.blobTableName = options.blobTableName;

    // store the reference to crate client
    this.crate = options.crate;

    this.persistFile = persistFile;
    
    /*
    path is the path to the file to persist
    callback is called with an error if one occurred
    */
    function persistFile(path, callback) {

        // store the initial stats data
        const stats = {
            path: path,
            start: new Date()
        };

        // start the timer
        const hrTimeStart = process.hrtime();

        /*
        store actual blob, then store metadata, then get size for stats
        */
        async.waterfall([
            // get bytes
            function (waterfallCallback) {
                fs.stat(path, function (error, fileStat) {
                    if (error) {
                        waterfallCallback(error);
                    } else {
                        stats.bytes = fileStat.size;
                        waterfallCallback(null, fileStat.size)
                    }
                });
            },

            // store blob
            function(size, waterfallCallback) {
                this.crate.insertBlobFile(this.blobTableName, path)
                    .success(function (hashKey) {
                        callback(null, hashKey, size);
                    })
                    .error(function (error) {
                        // passing error to waterfall cant continue
                        callback(error);
                    });
            },

            // store metadata
            function(hashKey, size, waterfallCallback) {
                // row to insert
                const row = {
                    path: path,
                    filename: path.basename(path),
                    hash: hashKey
                };

                this.crate.insert(this.metaTableName, row)
                    .success(function (response) {
                        // stop the timer for how long it took
                        const hrTimeEnd = process.hrtime(hrTimeStart);
                        stats.milliseconds = hrTimeEnd[0] * 1000 + t[1] / 1000000;

                        waterfallCallback(null);
                    })
                    .error(function (error) {
                        waterfallCallback(error);
                    });
            }

        ], function(error) {
            if (error) {
                const e = {
                    message: "Error persisting blob",
                    details: error
                };
                callback(e);

            } else {
                callback(null, stats);
            }
        });
    }
}

module.exports = persistBlob;
