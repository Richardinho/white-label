var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var wrap = require('gulp-wrap');
var sass = require('gulp-sass');
var Server = require('karma').Server;



gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./web"
        }
    });
});

gulp.task('build', function () {
	gulp.src([
	  'bower_components/richardUtils/src/dom.js',
	  'bower_components/richardUtils/src/sundry.js'])
		.pipe(gulp.dest('./web/lib'));
});

gulp.task('dependencies', function () {
	gulp.src([
		'bower_components/richardUtils/src/dom.js',
		'bower_components/richardUtils/src/sundry.js'])
		.pipe(gulp.dest('./build/lib'));
});

gulp.task('sass-for-build', function () {
	gulp.src('./scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('wrap-for-build', function () {
	gulp.src('./js/selection-box.js')
		.pipe(wrap({ src: './template.txt'}))
		.pipe(gulp.dest("./build"));
});

gulp.task('deploy', ['dependencies', 'wrap-for-build', 'sass-for-build']);

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('sass', function () {
	gulp.src('./scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./web/css'));
});

gulp.task('wrap', function () {
	gulp.src('./js/selection-box.js')
		.pipe(wrap({ src: './template.txt'}))
		.pipe(gulp.dest("./web/js"));
});

// watchers

gulp.task('watch-scss', function () {
   gulp.watch('./scss/**/*.scss', ['sass']);
});

