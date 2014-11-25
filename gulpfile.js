var gulp = require('gulp');
var mocha = require('gulp-mocha-phantomjs');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jsdoc = require('gulp-jsdoc');

gulp.task('build', function () {
    'use strict';
    return gulp.src('./src/event-queue.js')
        .pipe(uglify())
        .pipe(rename('event-queue.min.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('docs', function () {
    'use strict';
    return gulp.src('./src/**/*.js')
        .pipe(jsdoc('./docs'));
});

gulp.task('test', function () {
    'use strict';
    return gulp.src('./test/runner.html')
        .pipe(mocha());
});

gulp.task('default', function () {
    'use strict';
    gulp.start('test', 'docs', 'build');
});
