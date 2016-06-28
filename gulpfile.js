var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

gulp.task('uglify', function() {
	return gulp.src('./src/bng-selector.js')
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.basename += ".min";
			return path;
		}))
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