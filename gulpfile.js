var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');
var bump = require('gulp-bump');
var git = require('gulp-git');

gulp.task('pack-templates', function () {
	return gulp.src('./src/bng-selector.html')
		.pipe(templateCache({module: 'bng-selector'}))
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('develop', ['pack-templates'], function() {
	return gulp.src([
		'./src/bng-selector.js',
		'./tmp/templates.js'
	])
		.pipe(concat('bng-selector.min.js'))
		.pipe(gulp.dest('./demo'));
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

gulp.task('clean-css', ['uglify'], function() {
	return gulp.src([
			'./src/bng-selector.css'
		])
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename('bng-selector.min.css'))
		.pipe(gulp.dest('./dist'))
		.pipe(gulp.dest('./demo'));
});

gulp.task('watch', ['develop'], function() {
	gulp.watch(['./src/**/*'], ['develop']);
});

gulp.task('webserver', ['watch'], function() {
	gulp.src('./demo')
		.pipe(webserver({ port: 8000 }));
});

function inc(importance) {
	// get all the files to bump version in
	return gulp.src(['./package.json', './bower.json'])
	// bump the version number in those files
		.pipe(bump({type: importance}))
		// save it back to filesystem
		.pipe(gulp.dest('./'))
		// commit the changed version number
		.pipe(git.commit('bumps package version'))

		// read only one file to get the version number
		.pipe(filter('package.json'))
		// **tag it in the repository**
		.pipe(tagVersion());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });

gulp.task('push', function() {
	var packageJson = require('./package.json');
	git.push('origin', 'v' + packageJson.version, function (err) {
		if (err) throw err;
	});
});