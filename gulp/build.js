'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

require('./scripts');
require('./inject');
require('./watch');

var minifyHtml = require('gulp-htmlmin');
var angularTemplatecache = require('gulp-angular-templatecache');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');
var size = require('gulp-size');
var flatten = require('gulp-flatten');

var del = require('del');

gulp.task('partials', function () {
  return gulp.src(path.join(conf.paths.app, '/**/*.html'))
    .pipe(flatten({subPath: 2}))
    .pipe(minifyHtml({
      removeComments: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(angularTemplatecache('templateCacheHtml.js', {
      module: 'gridster2App',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.partials));
});

gulp.task('partials-directive', function () {
  return gulp.src(path.join(conf.paths.gridster, '/**/*.html'))
    .pipe(flatten({subPath: 2}))
    .pipe(minifyHtml({
      removeComments: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(angularTemplatecache('templateCacheHtmlDirective.js', {
      module: 'angular-gridster2',
      root: 'gridster2'
    }))
    .pipe(gulp.dest(conf.paths.partials));
});

gulp.task('html', function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.partials, '/templateCacheHtml.js'), {read: false});
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.partials,
    addRootSlash: false
  };
  var partialsDirectiveInjectFile = gulp.src(path.join(conf.paths.partials, '/templateCacheHtmlDirective.js'), {read: false});
  var partialsDirectiveInjectOptions = {
    starttag: '<!-- inject:partials-directive -->',
    ignorePath: conf.paths.partials,
    addRootSlash: false
  };

  var jsFilter = filter(path.join(conf.paths.tmp, '/**/*.js'), {restore: true});

  return gulp.src(path.join(conf.paths.serve, '/*.html'), {base: conf.paths.serve})
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
    .pipe(inject(partialsDirectiveInjectFile, partialsDirectiveInjectOptions))
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(jsFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe(size({title: path.join(conf.paths.dist, '/'), showFiles: true}));
});

gulp.task('clean', function () {
  return del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', gulp.series('clean', gulp.parallel('inject', 'partials', 'partials-directive'), 'html'));
require('./server');
