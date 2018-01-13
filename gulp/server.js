'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

function browserSyncInit(baseDir) {

  var routes = null;
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/node_modules': 'node_modules'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: 'default',
    ghostMode: false,
    notify: false
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('server', function () {
  browserSyncInit([conf.paths.serve, conf.paths.src]);
});

gulp.task('server-build', function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve', gulp.series('inject', 'watch', 'server'));

gulp.task('serve:dist', gulp.series('build', 'server-build'));
