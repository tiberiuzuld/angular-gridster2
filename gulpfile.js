const gulp = require('gulp'),
  inlineNg2Template = require('gulp-inline-ng2-template'),
  del = require('del');

gulp.task('clean', function () {
  return del(['./.tmp', './dist']);
});

gulp.task('inline-templates', function () {
  return gulp.src('./src/lib/*.ts')
    .pipe(inlineNg2Template({base: 'src/lib', UseRelativePaths: true, indent: 0, removeLineBreaks: true}))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('build', gulp.series('clean', 'inline-templates'));
