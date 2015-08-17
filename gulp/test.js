'use strict';

var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');

module.exports = function(options) {

	gulp.task('test', ['build'], function (done) {
		return gulp.src('test/index.js', {read: false})
		.pipe(mocha({
			env: {
				test:true,
				NODE_ENV:'dist'
			}
		}))
		.once('error', function () {
			process.exit(1);
		})
		.once('end', function () {
			process.exit();
		});
	})
};
