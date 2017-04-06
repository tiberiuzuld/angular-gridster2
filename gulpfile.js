const gulp = require('gulp'),
  inlineNg2Template = require('gulp-inline-ng2-template'),
  clean = require('gulp-clean');

gulp.task('clean', function () {
  return gulp.src(['./tmp', './dist'], {read: false})
    .pipe(clean());
});

gulp.task('inline-templates', ['clean'], function () {
  return gulp.src('./src/lib/*.ts')
    .pipe(inlineNg2Template({base: 'src/lib', UseRelativePaths: true, indent: 0, removeLineBreaks: true}))
    .pipe(gulp.dest('.tmp'));
});
