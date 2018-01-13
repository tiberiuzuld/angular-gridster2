'use strict';
/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var log = require('fancy-log');
var colors = require('ansi-colors');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  app: 'src/app',
  gridster: 'src/gridster2',
  dist: 'dist',
  tmp: '.tmp',
  serve: '.tmp/serve',
  partials: '.tmp/partials',
  e2e: 'e2e'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  return function (err) {
    log(colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
