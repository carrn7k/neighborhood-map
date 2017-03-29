 
 var gulp = require('gulp');

 var sass = require('gulp-sass');
 var autoprefixer = require('gulp-autoprefixer');
 var concat = require('gulp-concat');
 var uglify = require('gulp-uglify');
 var cleanCSS = require('gulp-clean-css');


 gulp.task('styles', function() {
 	gulp.src('static/sass/**/*.scss')
 	.pipe(sass().on('error', sass.logError))
 	.pipe(autoprefixer({
 		browsers: ['last 2 versions']
 	}))
 	.pipe(gulp.dest('static/css'))
 })

 gulp.task('scripts-dist', function() {
	gulp.src('static/js/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/static/js'));
 });

 gulp.task('clean-css', function() {
 	gulp.src('static/css/*.css')
 		.pipe(cleanCSS({compatibility: 'ie8'}))
 		.pipe(gulp.dest('dist/static/css'));
 })