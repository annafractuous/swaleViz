// Gulp – compile & minify files, run server, watch for changes
var gulp         = require('gulp'),
    concat       = require('gulp-concat'),            // concatenate scripts
    sass         = require('gulp-sass'),              // compile SASS files to CSS
    autoprefixer = require('gulp-autoprefixer'),      // auto-prefix CSS
    rename       = require('gulp-rename'),            // rename files when saving to build
    webserver    = require('gulp-webserver');


/*
  Compile Styles
*/
gulp.task('styles',function() {
    gulp.src('styles/style.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('build'))
});

/*
  Concatenate JS
*/
gulp.task('scripts', function() {
    gulp.src('scripts/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('build'));
});

/*
  Watch for Changes
*/
gulp.task('watch', function() {
    gulp.watch('scripts/*.js', ['scripts']);
    gulp.watch('styles/*.sass', ['styles']);
});

/*
  Webserver
*/
gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('default', ['styles', 'scripts', 'watch', 'webserver']);
