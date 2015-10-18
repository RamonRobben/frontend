var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    reload = browserSync.reload;

gulp.task('sass', function() {
  gulp.src(['./assets/css/main.scss', './assets/css/partials/*.scss'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('serve', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: '.',
      middleware: function (request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  });

  gulp.watch(['./assets/css/main.scss', './assets/css/partials/*.scss'], ['sass', reload]);
})

gulp.task('default', ['serve']);
