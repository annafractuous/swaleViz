// Gulp – compile & minify files, run server, watch for changes
var gulp         = require('gulp'),
    concat       = require('gulp-concat'),            // concatenate scripts
    babel        = require('gulp-babel'),             // transpile scripts to ES5
    uglify       = require('gulp-uglify'),            // minify scripts
    sass         = require('gulp-sass'),              // compile SASS files to CSS
    autoprefixer = require('gulp-autoprefixer'),      // auto-prefix CSS
    cleanCSS     = require('gulp-clean-css'),         // minify styles
    rename       = require('gulp-rename'),            // rename files when saving to build
    pump         = require('pump');                   // error handling
    webserver    = require('gulp-webserver');


/*
  Compile Styles
*/
gulp.task('styles',function(cb) {
    pump([
        gulp.src('styles/style.sass'),
        sass(),
        autoprefixer(),
        gulp.dest('build'),
        cleanCSS(),
        rename({ suffix: '.min' }),
        gulp.dest('build')
    ],
    cb);
});

/*
  Concatenate JS
*/
gulp.task('scripts', function(cb) {
    pump([
        gulp.src('scripts/*.js'),
        concat('script.js'),
        gulp.dest('build'),
        babel({ presets: ['es2015'] }),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest('build')
    ],
    cb);
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
