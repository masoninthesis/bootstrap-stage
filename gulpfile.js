var gulp         = require('gulp')
var path         = require('path')
var less         = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var sourcemaps   = require('gulp-sourcemaps')
var minifyCSS    = require('gulp-minify-css')
var rename       = require('gulp-rename')
var concat       = require('gulp-concat')
var uglify       = require('gulp-uglify')
var connect      = require('gulp-connect')
var open         = require('gulp-open')
var htmlreplace  = require('gulp-html-replace')
// var imagemin     = require('gulp-imagemin')
// var pngquant     = require('imagemin-pngquant')

var Paths = {
  HERE                 : './',
  DIST                 : 'dist',
  IMG                  : 'dist/img/',
  // SVG                  : 'dist/svg/',
  DIST_TOOLKIT_JS      : 'dist/toolkit.js',
  LESS_TOOLKIT_SOURCES : './less/toolkit*',
  LESS                 : './less/**/**',
  JS                   : [
      './js/bootstrap/transition.js',
      './js/bootstrap/alert.js',
      './js/bootstrap/affix.js',
      './js/bootstrap/button.js',
      './js/bootstrap/carousel.js',
      './js/bootstrap/collapse.js',
      './js/bootstrap/dropdown.js',
      './js/bootstrap/modal.js',
      './js/bootstrap/tooltip.js',
      './js/bootstrap/popover.js',
      './js/bootstrap/scrollspy.js',
      './js/bootstrap/tab.js',
      './js/custom/*'
    ]
}

gulp.task('default', ['less-min', 'js-min'])

gulp.task('watch', function () {
  gulp.watch(Paths.LESS, ['less-min']);
  gulp.watch(Paths.JS,   ['js-min']);
})

gulp.task('docs', ['server'], function () {
  gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:9001/docs/'}))
})

gulp.task('server', function () {
  connect.server({
    root: 'docs',
    port: 9001,
    livereload: true
  })
})

gulp.task('less', function () {
  return gulp.src(Paths.LESS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest('dist'))
})

gulp.task('less-min', ['less'], function () {
  return gulp.src(Paths.LESS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(autoprefixer())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.DIST))
})

gulp.task('js', function () {
  return gulp.src(Paths.JS)
    .pipe(concat('toolkit.js'))
    .pipe(gulp.dest(Paths.DIST))
})

gulp.task('js-min', ['js'], function () {
  return gulp.src(Paths.DIST_TOOLKIT_JS)
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(Paths.DIST))
})

/////////////////////////////////////////////
// My custom stuff for the minimal theme only
/////////////////////////////////////////////
// Before Deployment to Production (and possibly staging)

gulp.task('pro', ['img-cmp', 'html-repath', 'html-dist'])

// Relocates images
gulp.task('img-cmp', function () {
  return gulp.src('docs/assets/img/*')
    .pipe(gulp.dest(Paths.IMG))
})

// This replaces the file paths
// You can configure the images to save time
gulp.task('html-repath', function() {
  gulp.src('docs/minimal/index.html')
    .pipe(htmlreplace({
        'css': 'dist/toolkit-minimal.min.css',
        //'img1': 'dist/img/iphone-to-iphone-sized.jpg',
        //'img2': 'dist/img/avatar-mdo.png',
        //'img3': 'dist/img/iphone-perspective-sized.jpg',
        //'img4': 'dist/img/iphone-flat-sized.jpg',
        //'img5': 'dist/img/iphone-reverse-perspective-sized.jpg',
        'js': 'dist/toolkit.min.js'
    }))
    .pipe(gulp.dest('dist/'));
})
// This relocates the index
gulp.task('html-dist', function () {
  return gulp.src('docs/minimal/*')
    .pipe(gulp.dest(Paths.HERE))
})
// gulp.task('pro', ['less-min', 'js-min', 'img-cmp', 'svgo'])
//
// gulp.task('svgo', function () {
//   return gulp.src(Paths.LESS_TOOLKIT_SOURCES)
//     .pipe(gulp.dest(Paths.SVG))
// })
