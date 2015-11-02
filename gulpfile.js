var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var notifier = require('node-notifier');
var source = require('vinyl-source-stream');

var notify = function(error) {
  console.error(error.stack);
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

gulp.task('browserify', function() {
  browserify('./src/js/main.js')
    .transform('reactify')
    .bundle()
    .on('error', notify)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./extension/dist/js'));
});

gulp.task('default',['browserify'], function() {
  return gulp.watch('src/**/*.*', ['browserify']);
});