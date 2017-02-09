 
 var gulp = require('gulp');

 var browserSync = require('browser-sync').create();
 var watch = require('gulp-watch');
 var sass = require('gulp-sass');
 var autoprefixer = require('gulp-autoprefixer');

 //gulp.task('default', ['styles'], function() {
 //	gulp.watch('sass/**/*.scss', ['styles']).on('change', browserSync.reload);
 //})

 gulp.task('styles', function() {
 	gulp.src('sass/**/*.scss')
 	.pipe(sass().on('error', sass.logError))
 	.pipe(autoprefixer({
 		browsers: ['last 2 versions']
 	}))
 	.pipe(gulp.dest('./css'))
 })


 /*browserSync.init({
	server: './'
});
browserSync.stream();*/