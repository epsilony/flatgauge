'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var shelljs = require('shelljs');

function buildBundle(){
  shelljs.exec('jspm bundle ./lib/main bundle/bundle.js --inject');
}

function unbundle(){
  shelljs.exec('jspm unbundle');
}

gulp.task('unbundle',function(){
  unbundle();
});

gulp.task('bundle', function() {
  buildBundle();
});

gulp.task('watch',['unbundle'], function() {

  browserSync.init({
    server: "."
  });

  gulp.watch("lib/**/*.{js,html,css}").on('change', browserSync.reload);
  gulp.watch("*.html",browserSync.reload());
});

gulp.task('default', ['watch']);
