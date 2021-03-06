(function() {
  'use strict';

  var path = require('path'),
      gulp = require('gulp'),
      minimist = require('minimist'),
      Generator = require('./generator/generator').Generator;

  var paths = {
    scripts: ['generator/features/**/*.js'],
    cardsContent: ['cards/**/*.md'],
    cardsLang: ['cards/**/*.po'],
    templates: ['templates/**/*.json', 'templates/**/*.jpg', 'templates/**/*.png']
  };

  var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
  };

  var options = minimist(process.argv.slice(2), knownOptions);

  function _generate(template, lang) {
    new Generator({
      template: template,
      lang: lang
    });
  }

  gulp.task('watch', function() {
    gulp.watch(paths.templates, function(args) {
      var template = path.dirname(args.path).replace(path.join(__dirname, 'templates') + '/', '');
       if (template) {
          _generate(template);
        }
    });
    gulp.watch(paths.scripts, function() {
      _generate();
    });
    gulp.watch(paths.cardsContent, function() {
      _generate();
    });
    gulp.watch(paths.cardsLang, function(args) {
      var lang = path.basename(args.path, '.po').split('.')[1];
      console.log(path.basename(args.path, '.po'), lang);
      _generate(null, lang);
    });
  });

  gulp.task('generate', function() {
    _generate(options.template, options.lang);
  });

  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['watch']);

})();