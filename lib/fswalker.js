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

    // remove this portion from all files
    if (this.options.pathModifierRemove) {
        let pathModifierLength = this.options.pathModifierRemove.length;
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].substr(0, pathModifierLength) === this.options.pathModifierRemove) {
                // they have the same path portion, remove it
                this.files[i] = this.files[i].substr(pathModifierLength);
            }
        }
    }
}

module.exports = fswalker;
