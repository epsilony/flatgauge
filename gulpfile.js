'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var shelljs = require('shelljs');

function buildBundle(){
  shelljs.exec('jspm bundle ./lib/main dist/flatgauge.js --inject');
}

gulp.task('bundle', function() {
  buildBundle();
});

gulp.task('watch', function() {

  browserSync.init({
    server: "."
  });

  function watchBundle() {
   // buildBundle();
    browserSync.reload();
  }
  gulp.watch("lib/**/*.{js,html,css}").on('change', watchBundle);
  gulp.watch("*.html",browserSync.reload());
});

gulp.task('default', ['watch']);
