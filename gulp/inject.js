'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function () {
  browserSync.reload();
});

gulp.task('inject', ['scripts'], function () {
  var injectStylesDirective = gulp.src([
    path.join(conf.paths.src, '/gridster2/**/*.css')
  ], {read: false});

  var stylesInjectOptionsDirective = {
    starttag: '<!-- inject:directive:css -->',
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  var injectScriptsDirective = gulp.src([
      path.join(conf.paths.src, '/gridster2/**/*.module.js'),
      path.join(conf.paths.src, '/gridster2/**/*.js'),
      path.join('!' + conf.paths.src, '/gridster2/**/*.spec.js')
    ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var scriptsInjectOptionsDirective = {
    starttag: '<!-- inject:directive:js -->',
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], {read: false});

  var injectScripts = gulp.src([
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join('!' + conf.paths.src, '/app/**/*.spec.js')
    ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStylesDirective, stylesInjectOptionsDirective))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScriptsDirective, scriptsInjectOptionsDirective))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
