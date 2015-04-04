var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gulpTap = require('gulp-tap');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');

var sourceFiles = [
  'src/uiForm*.js',
  'src/main.js',
  '!src/*.specs.js'
];

function build(min){
  var filename = 'apogee.ui-forms' + (min ? '.min' : '') + '.js';

  return gulp.src(sourceFiles)
             .pipe(gulpTap(function(f){ console.log('[process] ' + f.path); }))
             .pipe(sourcemaps.init())
             .pipe(concat(filename))
             .pipe(gulpIf(min, ngAnnotate({ add: true, single_quotes: true })))
             .pipe(sourcemaps.write())
             .pipe(gulpIf(min, uglify()))
             .pipe(wrap('(function(){<%= contents %>})();'))
             .pipe(gulp.dest('build'))
             ;
}

gulp.task('build_dev', function(){ return build(); });
gulp.task('build_pro', function(){ return build(true); });

gulp.task('build', ['build_dev', 'build_pro']);
