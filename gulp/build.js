'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
      path.join(conf.paths.src, '/app/**/*.html'),
      path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
    .pipe($.minifyHtml({
      removeComments: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'gridster2App',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {read: false});
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  //var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter(path.join(conf.paths.tmp, '/**/*.js'), {restore: true});
  //var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    //.pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    //.pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    //.pipe($.rev())
    //.pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    //.pipe(cssFilter)
    //.pipe($.sourcemaps.init())
    //.pipe($.minifyCss({ processImport: false }))
    //.pipe($.rev())
    //.pipe($.sourcemaps.write('maps'))
    //.pipe(cssFilter.restore)
    //.pipe($.revReplace())
    //.pipe(htmlFilter)
    // .pipe($.minifyHtml({
    //   removeComments: true,
    //   removeAttributeQuotes: true,
    //   collapseBooleanAttributes: true,
    //   collapseWhitespace: true
    // }))
    //.pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: true}));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
      path.join(conf.paths.src, '/**/*'),
      path.join('!' + conf.paths.src, '/**/*.{html,css,js}')
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', ['html', 'other']);
