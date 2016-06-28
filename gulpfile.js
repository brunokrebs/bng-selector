var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');

gulp.task('pack-templates', function () {
	return gulp.src('./src/bng-selector.html')
		.pipe(templateCache({module: 'bng-selector'}))
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('uglify', ['pack-templates'], function() {
	return gulp.src([
			'./src/bng-selector.js',
			'./tmp/templates.js'
		])
		.pipe(concat('bng-selector.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
		.pipe(gulp.dest('./demo'));
});

gulp.task('watch', ['uglify'], function() {
	gulp.watch(['./src/**/*'], ['uglify']);
});

gulp.task('webserver', ['watch'], function() {
	gulp.src('./demo')
		.pipe(webserver({ port: 8000 }));
});