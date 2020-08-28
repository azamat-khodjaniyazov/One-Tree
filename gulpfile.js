const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const del = require('del');


gulp.task('html', function(callback) {
   return gulp.src('.src/html/*.html')
   .pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'HTML include',
				sound: false,
				message: err.message
			}
		})
	}))
   .pipe(fileinclude({
   	prefix: '@@'
   }))
	 .pipe(gulp.dest('./src/'))
	 .pipe(browserSync.stream())
   callback();
});

gulp.task('scss', function(callback) {
	return gulp.src('./src/scss/style.scss')
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'Styles',
				sound: false,
				message: err.message
			}
		})
	}))
	.pipe(sass())
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 4 versions']
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./build/css/'))
	.pipe(browserSync.stream())
	callback();
});

gulp.task('copy:img', function(callback) {
	return gulp.src('./src/img/**/*.*')
	.pipe(gulp.dest('./build/img'))
	.pipe(browserSync.stream())
	callback();
});

gulp.task('copy:html', function(callback) {
	return gulp.src('./src/html/*.html')
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'HTML include',
				sound: false,
				message: err.message
			}
		})
	}))
   .pipe(fileinclude({
   	prefix: '@@'
   }))
	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream())
	callback();
});

gulp.task('copy:js', function(callback) {
	return gulp.src('./src/js/**/*.*')
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream())
	callback();
});

gulp.task('copy:css', function(callback) {
	return gulp.src('./src/css/**/*.*')
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream())
	callback();
});

gulp.task('copy', function(callback) {
	return gulp.src('./src/fonts/**/*.*')
	.pipe(gulp.dest('./build/fonts'))
	.pipe(browserSync.stream())
	callback();
});


gulp.task('watch', function() {
	watch(['./build/img/**/*.*', './build/js/**/*.*', './build/css/**/*.*'], gulp.parallel(browserSync.reload));

	watch('./src/scss/**/*.scss', function() {
		setTimeout(gulp.parallel('scss'), 1000)
	});

	// watch('./src/html/**/*.html', gulp.parallel('html'))
	watch('./src/html/**/*.html', gulp.parallel('copy:html'))

	watch('./src/img/**/*.*', gulp.parallel('copy:img'))
	watch('./src/js/**/*.*', gulp.parallel('copy:js'))
	watch('./src/css/**/*.*', gulp.parallel('copy:css'))
	
});

gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
});

gulp.task('clean:build', function() {
	return del('./build')
});


gulp.task('default', gulp.series(gulp.parallel('clean:build'), gulp.parallel('scss', 'html', 'copy:img', 'copy:js', 'copy:html', 'copy:css', 'copy'), gulp.parallel('server', 'watch'),));