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
const webp = require('gulp-webp');
const replace = require('gulp-replace');
const util = require('gulp-util');

const db_server_port = 1337;

function compile(watch) {
    const bundler_main = watchify(browserify('./src/js/main.js', {
        debug: !util.env.production
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
                loadMaps: !util.env.production
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
        debug: !util.env.production
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
                loadMaps: !util.env.production
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
    gulp.watch('src/sw.js', ['sw']);
    return compile(true);
};

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass(({
            outputStyle: 'compressed'
        }))) // Using gulp-sass
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(replace('@@maps_api_key', process.env.MAPS_API_KEY))
        .pipe(gulp.dest('dist'))
});

gulp.task('sw', function () {
    return gulp.src('src/sw.js')
        .pipe(gulp.dest('dist'))
});

gulp.task('manifest', function () {
    //do images here
    return gulp.src('src/manifest.json')
        .pipe(gulp.dest('dist'))
});

gulp.task('ico', function () {
    //do images here
    return gulp.src('src/favicon.ico')
        .pipe(gulp.dest('dist'))
});

gulp.task('webp', function () {
    return gulp.src('dist/img/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('dist/img'))
});

gulp.task('clean', function () {
    return del('dist/**', {
        force: true
    });
});

gulp.task('minify', function () {

})

gulp.task('build', function () {
    return compile();
});

gulp.task('watch', function () {
    return watch();
});

gulp.task('images', ['grunt-images'], function () {
    // return gulp.start('webp');
});

// Default task
gulp.task('default', ['clean'], function () {
    return (!!util.env.production) ?
        gulp.start('build', 'grunt-connect', 'html', 'sw', 'manifest', 'ico', 'sass', 'images') : //production
        gulp.start('watch', 'grunt-connect', 'html', 'sw', 'manifest', 'ico', 'sass', 'images')
});