'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	var serveStatic = require('serve-static');
	var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
	var rewrite = require('connect-modrewrite');

	grunt.initConfig({

		compass: {
			compile: {
				options: {
					sassDir: 'src/assets/images/',
					cssDir: 'src/assets/images/',
					specify: 'src/assets/images/{,*/}*.scss',
					imagesDir: 'src'
				}
			}
		},

		connect: {
			options: {
				port: 9000,
				base: 'dist',
				open: true,
				livereload: 35729,
				hostname: 'localhost',
				keepalive: true
			},
			proxies: [{
				context: ['/api'],
				host: 'https://portal.maytronics.co',
				port: 443,
				https: true,
				changeOrigin: true
			}],
			livereload: {
				options: {
					open: true,
					base: 'dist',
					middleware: function (connect, options) {
						var middlewares = [];
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
						middlewares.push(serveStatic('dist'));
						var rules = [
							'^/$ /index.html'
						];
						middlewares.unshift(rewrite(rules));

						return middlewares;
					}
				}
			},
		},

		replace: {
			distCss: {
				src: ['dist/styles.bundle.css'],             // source files array (supports minimatch)
				dest: 'dist/styles.bundle.css',             // destination directory or file
				replacements: [{
					from: '/assets',                   // string replacement
					to: 'assets'
				}]
			}
		}

	});

	grunt.registerTask('serve-dist', [
		'configureProxies:server',
		'connect:livereload'
	]);

};
