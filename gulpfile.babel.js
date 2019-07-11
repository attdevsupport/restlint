const gulp = require('gulp');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const eslint = require('gulp-eslint');
const inlinesrc = require('gulp-inline-source');
const csslint = require('gulp-csslint');
const babel = require('gulp-babel');
const stripDebug = require('gulp-strip-debug');

// Note: the '**/' is needed as a prefix to
// preserve the directory structure.


// To move and minify JS assests.
var DEST = 'dist/';
gulp.task('eslint', function() {
  return gulp.src(['src/**/*.js', '!**/boot*', '!**/jquery*',  '!**/knock*', '!**/xlsx*', '!node_modules/', '!node_modules/**', '!dist/', '!dist/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('js', ['eslint'], function() {
  return gulp.src(['src/**/*.js', '!node_modules/', '!node_modules/**', '!dist/', '!dist/**'])
    .pipe(stripDebug())
    .pipe(babel())
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest(DEST));
});

gulp.task('img', function() {
  return gulp.src(['src/**/*.png', '**/images/*.jpg', '**/images/*.gif', '!node_modules/', '!node_modules/**', '!dist/', '!dist/**'])
    .pipe(gulp.dest(DEST));
});

// // just to run csslint, since CSS gets inlined in HTML, and copy over bootstrap
// gulp.task('csslint', function() {
//   return gulp.src(['src/**/*.css', '!node_modules/', '!node_modules/**', '!dist/', '!dist/**'])
//     .pipe(csslint())
//     .pipe(csslint.formatter());
// });

// just to run csslint, since CSS gets inlined in HTML, and copy over bootstrap
gulp.task('css', function() {
  return gulp.src(['src/**/boot*.css', 'src/**/all*.css', 'src/**/fa-*', '!node_modules/', '!node_modules/**', '!dist/', '!dist/**'])
    .pipe(gulp.dest(DEST));
});

gulp.task('html', ['css'], function() {
  return gulp.src(['src/index.html', '!node_modules/', '!node_modules/**', '!dist/', '!dist/**'])
    .pipe(inlinesrc())
    .pipe(htmlmin({collapseWhitespace: true,minifyJS:true,minifyCSS:true,removeComments:false}).on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest(DEST));
});


gulp.task('main', ['html', 'js', 'img']);