'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

gulp.task('watch', function (done) {
  gulp.watch([path.join(conf.paths.src, '/*.html'), 'package.json'])
    .on('add', gulp.parallel('inject-reload'))
    .on('change', gulp.parallel('inject-reload'))
    .on('unlink', gulp.parallel('inject-reload'));

  gulp.watch([path.join(conf.paths.app, '/**/*.css'), path.join(conf.paths.gridster, '/**/*.css')])
    .on('add', gulp.parallel('inject-reload'))
    .on('change', browserSync.reload)
    .on('unlink', gulp.parallel('inject-reload'));

  gulp.watch([path.join(conf.paths.app, '/**/*.js'), path.join(conf.paths.gridster, '/**/*.js')])
    .on('add', gulp.parallel('inject-reload'))
    .on('change', gulp.parallel('inject-reload'))
    .on('unlink', gulp.parallel('inject-reload'));

  gulp.watch([path.join(conf.paths.app, '/**/*.html'), path.join(conf.paths.gridster, '/**/*.html')])
    .on('add', gulp.parallel('inject-reload'))
    .on('change', browserSync.reload)
    .on('unlink', gulp.parallel('inject-reload'));

  done();
});
