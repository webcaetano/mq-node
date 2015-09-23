'use strict';

var gulp = require('gulp');
var path = require('path');
var webpack = require('webpack');
var cp = require('child_process');
var merge = require('lodash/object/merge');

var $ = require('gulp-load-plugins')();

var started = false;
var server;

var DEBUG = false;
var STYLE_LOADER = 'style-loader/useable';
var CSS_LOADER = DEBUG ? 'css-loader' : 'css-loader?minimize';
var GLOBALS = {
	'__DEV__': DEBUG
};

var config = {
	output: {
		publicPath: './',
		sourcePrefix: '  '
	},
	cache: DEBUG,
	debug: DEBUG,
	stats: {
		colors: true,
		reasons: DEBUG
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin()
	],
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	}
}



module.exports = function(options) {
	var serverConfig = merge({}, config, {
		entry: './' + options.src + '/index.js',
		output: {
			// path: './../.tmp/serve/node',
			filename: 'index.js',
			libraryTarget: 'commonjs2'
		},
		target: 'node',
		externals: [
			function (context, request, cb) {
				var isExternal =
					request.match(/^[a-z][a-z\/\.\-0-9]*$/i) &&
					!request.match(/^react-routing/) &&
					!context.match(/[\\/]react-routing/);
				cb(null, Boolean(isExternal));
			}
		],
		node: {
			console: false,
			global: false,
			process: false,
			Buffer: false,
			__filename: false,
			__dirname: false
		},
		// devtool: DEBUG ? 'source-map' : 'cheap-module-source-map',
		plugins: config.plugins.concat(
			new webpack.DefinePlugin(merge(GLOBALS, {'__SERVER__': true}))
			// new webpack.BannerPlugin('require("source-map-support").install();',
			// 	{ raw: true, entryOnly: false })
		),
		module: {
			loaders: [
			{
				test: /\.js?$/,
				exclude:['node_modules'],
				loader: 'babel-loader'
			}]
		}
	});

	function getWebpack(path, watch, callback, reload) {

		var webpackChangeHandler = function(err, stats) {
			if(err) {
				options.errorHandler('Webpack')(err);
			}
			$.util.log(stats.toString({
				colors: $.util.colors.supportsColor,
				chunks: false,
				hash: false,
				version: false
			}));
		};

		serverConfig.watch = watch;


		return gulp.src(options.src + '/index.js')
			.pipe($.webpack(serverConfig, null, webpackChangeHandler))
			.pipe(gulp.dest(path));
	}

	gulp.task('build', function (callback) {
		return getWebpack(options.dist, false, callback);
	});
};
