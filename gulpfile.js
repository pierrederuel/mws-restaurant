var gulp = require('gulp');
require('gulp-grunt')(gulp);
var sass = require('gulp-sass');

// gulp.task('default', defaultTask);

// function defaultTask(done) {
//     // place code for your default task here
//     done();
// }
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('src/css'))
});
gulp.task('watch', function () {

    gulp.watch('src/scss/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch', 'grunt-serve']);