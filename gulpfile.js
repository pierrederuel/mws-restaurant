const gulp = require('gulp');
require('gulp-grunt')(gulp);
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const del = require('del');

const replace = require('gulp-replace');

const db_server_port = 1337;

function compile(watch) {
    const bundler_main = watchify(browserify('./src/js/main.js', {
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
            console.log('-> bundling bundle_main...');
            rebundle();
        });
    }
    rebundle();
    const bundler_res = watchify(browserify('./src/js/restaurant_info.js', {
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
            console.log('-> bundling bundle_restaurant...');
            rebundle_res();
        });
    }
    rebundle_res();
}

function watch() {
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/*.html', ['html']);
    return compile(true);
};

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(replace('@@maps_api_key', process.env.MAPS_API_KEY))
        .pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
    return del('dist/**', {
        force: true
    });
});

gulp.task('build', function () {
    return compile();
});
gulp.task('watch', function () {
    return watch();
});
// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('watch', 'html', 'sass', 'grunt-gulp');
});