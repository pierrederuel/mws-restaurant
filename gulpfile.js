var gulp = require('gulp');
require('gulp-grunt')(gulp);
var sass = require('gulp-sass');

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

var replace = require('gulp-replace');

const db_server_port = 1337;

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('dist/css'))
});

function compile(watch) {

    var bundler_main = watchify(browserify('./src/js/main.js', {
        debug: true
    }).transform(babel));

    function rebundle() {
        bundler_main.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('bundle_main.js'))
            .pipe(replace('@@server_port', db_server_port))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'));
    }

    if (watch) {
        bundler_main.on('update', function () {
            console.log('-> bundling main...');
            rebundle();
        });
    }

    rebundle();

    var bundler_res = watchify(browserify('./src/js/restaurant_info.js', {
        debug: true
    }).transform(babel));

    function rebundle_res() {
        bundler_res.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('bundle_restaurant.js'))
            .pipe(replace('@@server_port', db_server_port))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'));
    }

    if (watch) {
        bundler_res.on('update', function () {
            console.log('-> bundling res...');
            rebundle_res();
        });
    }

    rebundle_res();
}

function watch() {
    gulp.watch('src/scss/*.scss', ['sass']);
    return compile(true);
};

gulp.task('build', function () {
    return compile();
});
gulp.task('watch', function () {
    return watch();
});

gulp.task('default', ['grunt-gulp', 'sass', 'watch']);