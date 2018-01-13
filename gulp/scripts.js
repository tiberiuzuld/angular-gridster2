'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var eslint = require('gulp-eslint');
var size = require('gulp-size');

gulp.task('scripts-reload', function () {
  return buildScripts().pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return buildScripts();
});

var buildScripts = function () {
  return gulp.src([path.join(conf.paths.app, '/**/*.js'), path.join(conf.paths.gridster, '/**/*.js')])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(size())
};
