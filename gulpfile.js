var gulp = require('gulp'),
sass = require('gulp-sass')

gulp.task('sass', function(){
	gulp.src(['./assets/css/main.scss', './assets/css/partials/*.scss'])
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(gulp.dest('./assets/css'))
	})

gulp.task('default', ['sass'], function(){
	gulp.watch(['./assets/css/main.scss', './assets/css/partials/*.scss'], ['sass']);
	})
