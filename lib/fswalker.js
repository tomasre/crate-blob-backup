'use strict';

var glob = require("glob");

/*
walks through all the directories and subdirectories in backupPath (synchronously)
makes a list of all the files which need to be backed up
accessed as fswalker.files
 */
function fswalker(options) {
    this.options = options;
    var fname = this.options.backupPath;

    if (fname.substr(-1) !== '/') {
      fname += '/';
    }
    // all the files to back up
    this.files = glob.sync( fname + '**', {
      nodir: true
    });
}

module.exports = fswalker;
