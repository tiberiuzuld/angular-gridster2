'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var browserSync = require('browser-sync');


gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

gulp.task('inject-files', function () {
  var injectStylesDirective = gulp.src([
    path.join(conf.paths.gridster, '/**/*.css')
  ], {read: false});

  var stylesInjectOptionsDirective = {
    starttag: '<!-- inject:directive:css -->',
    ignorePath: [conf.paths.src, conf.paths.serve],
    addRootSlash: false
  };

  var injectScriptsDirective = gulp.src([
    path.join(conf.paths.gridster, '/**/*.module.js'),
    path.join(conf.paths.gridster, '/**/*.js')
  ])
    .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var scriptsInjectOptionsDirective = {
    starttag: '<!-- inject:directive:js -->',
    ignorePath: [conf.paths.src, conf.paths.serve],
    addRootSlash: false
  };

  var injectStyles = gulp.src([
    path.join(conf.paths.app, '/**/*.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.app, '/**/*.module.js'),
    path.join(conf.paths.app, '/**/*.js')
  ])
    .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, conf.paths.serve],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'), {base: conf.paths.src})
    .pipe(inject(injectStylesDirective, stylesInjectOptionsDirective))
    .pipe(inject(injectStyles, injectOptions))
    .pipe(inject(injectScriptsDirective, scriptsInjectOptionsDirective))
    .pipe(inject(injectScripts, injectOptions))
    .pipe(gulp.dest(path.join(conf.paths.serve)));
});

gulp.task('inject', gulp.series('scripts', 'inject-files'));
gulp.task('inject-reload', gulp.series('inject', 'reload'));
