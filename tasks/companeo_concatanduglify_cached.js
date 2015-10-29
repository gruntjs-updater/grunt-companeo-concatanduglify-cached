/*
 * grunt-companeo-concatanduglify-cached
 * https://github.com/Companeo/grunt-companeo-concatanduglify-cached
 *
 * Copyright (c) 2014 companeo
 * Licensed under the MIT license.
 */

/*globals module, require, console */

module.exports = function (grunt) {
    'use strict';

    var uglify = require('uglify-js'),
        chalk = require('chalk');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('companeo_concatanduglify_cached', 'Uglify each file only if necessary and concat all after.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                separator: ';',
                no_compress: true,
                ultraVerbose: false
            }),
            res;

        grunt.log.writeln('Options used : ', JSON.stringify(options, null, 2));

        if (options.ultraVerbose) {
            grunt.log.writeln('All files concerned', JSON.stringify(this.files));
        }

        // Iterate over all specified file groups.
        this.files.forEach(function (file) {
            // Concat specified files

            var src;

            try {
                src = file.orig.src.filter(function (filepath) {
                    // Warn on and remove invalid source files (if nonull was set)
                    if (options.ultraVerbose) {
                        grunt.log.writeln('Current filepath', filepath);
                    }
                    if (!grunt.file.exists(filepath)) {
                        grunt.fail.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                }).map(function (filepath) {
                    return grunt.file.read(filepath);
                }).join(grunt.util.normalizelf(options.separator));

                if (!grunt.file.exists(file.dest + '.js') || src !== grunt.file.read(file.dest + '.js')) {
                    grunt.log.writeln('creation', file.dest);
                    grunt.file.write(file.dest + '.js', src);

                    if (!options.no_compress) {
                        res = uglify.minify(file.dest + '.js', file.dest + '.min.js');
                        grunt.file.write(file.dest + '.min.js', res.code);
                    } else {
                        grunt.file.copy(file.dest + '.js', file.dest + '.min.js')
                    }
                } else {
                    grunt.log.writeln('rejet', file.dest);
                }
            } catch (eX) {
                grunt.log.writeln('eX', eX.message, eX.stack, JSON.stringify(eX));
            }
        });
    });
};