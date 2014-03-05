//TODO
// [] gulp dist tasks
// []   compress less, no sourcemaps
// []   no source maps on js, uglify

var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    bundler = watchify('./src/scripts/app.js'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    fileinclude = require('gulp-file-include'),
    lr

function rebundle() {
  return bundler.bundle()
    .pipe(source('bundle.js'))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./app/js'))
    .pipe(livereload(lr))
}

function startExpress() {
  var express = require('express'),
      app = express()
  app.use(express.static(__dirname + "/app"))
  app.listen(8000)
}

function notifyLiveReload(event) {
  gulp.src(event.path, {read: false})
  .pipe(livereload(lr))
}

gulp.task('xify', rebundle)

gulp.task('bootstrap', function() {
  gulp.src('src/bootstrap/styles.less')
    .pipe(plumber())
    .pipe(less())
    .on("error", notify.onError(function() {
      return "Oops, LESS error"
    }))
    .pipe(gulp.dest('src/styles/'))
})

gulp.task('less', function() {
  gulp.src('src/styles/app.less')
    .pipe(plumber())
    .pipe(less())
    .on("error", notify.onError(function() {
      return "Oops, less error"
    }))
    .pipe(gulp.dest('app/css/'))
    .pipe(livereload(lr))
})

gulp.task('pages', function() {
  gulp.src('src/*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('app/'))
    .pipe(livereload(lr))
})

gulp.task('watch', ['xify'], function() {
  startExpress()
  bundler.on('update', rebundle)
  gulp.watch('src/**/*.html', ['pages'])
  gulp.watch("src/bootstrap/*.less", ['bootstrap'])
  gulp.watch(["src/styles/*.less", "src/styles/*.css"], ['less'])
  gulp.watch('app/tweak.css', notifyLiveReload)
})

gulp.task('default', ['watch'])
gulp.task('init', ['pages', 'less', 'watch'])
gulp.task('dist', [])
