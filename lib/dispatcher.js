'use strict';

const async = requre('async');

/*
dispatches a list of files to crate
*/
function dispatcher(options, files, persister) {

    // how many to run in parallel
    this.parallelCount = options.parallelCount;

    // store the files
    this.files = files;

    // store the stats for each file which gets persisted
    this.stats = [];

    // keep track of errors which occurred - dont want to stop on one error
    this.errors = [];

    // ref the persistblob instance
    this.persister = persister;

    this.dispatchFiles = dispatchFiles;

    /*
    callback is called with error if one occurred and the stats array
    */
    function dispatchFiles (callback) {
        async.eachLimit(this.files, this.parallelCount, processOneFile, dispatchingFilesFinished);

        // defined here for access to dispatchFiles callback
        function dispatchingFilesFinished() {
            // NOTE: ignoring possible error because processOneFile never passes error to async
            if (this.errors.length > 0) {
                callback(this.errors);
            } else {
                callback(null, this.stats);
            }
        }
    }

    /*
    processes one of the files using the persister
    NOTE: errors are not passed to async but instead stored internally in this.errors
    */
    function processOneFile(path, callback) {

        this.persister.persistFile(path, function (error, stats) {
            if (error) {
                this.errors.push(error);
            } else {
                this.stats.push(stats);
            }
            callback(null);
        });
    }
}

module.exports = dispatcher;
