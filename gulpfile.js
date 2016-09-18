// Gulp – compile & minify files, run server, watch for changes
var gulp = require('gulp');
var concat = require('gulp-concat');                  // concatenate scripts
var sass = require('gulp-sass');                      // compile SASS files to CSS
var autoprefixer = require('gulp-autoprefixer');      // auto-prefix CSS
var rename = require('gulp-rename');                  // rename files when saving to build


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

gulp.task('default', ['styles', 'scripts', 'watch']);
