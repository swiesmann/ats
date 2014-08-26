/*
  MBP addons for configuration files.

  - It reads a YAML file and returns it as an object

  - Creates an object that gulp-replace-task can use to replace variables throughout the code.
    It requires an array of variable names from the config file. Even dot-notation works.
    E.g. for "@@some.things" would be the "thing" property of the "some" object.

  Example:

    var mbp = require('mbp');

    var config = mbp.config('config/global.yml');
    var replace_patterns = mbp.getReplacePatterns([
      "project_name",
      "project_lang",
      "some.thing.else"
    ]);

  Notes:

    To make it really awesome it would be nice that you don't even need to define
    what variables gets replaced, but that is something for the future if even doable in a good way.

  Todo:
    Add a way to locally overwrite values.
    Maybe add an option to ask for values on evaluation. This could be useful for passwords etc.
    Why is there no __getattr__ :(
 */

var _ = require('lodash');
var YAML = require('yamljs');


module.exports = function() {
  // "private" vars and helpers
  var _replace_vars = undefined;
  var _config_filename = undefined;
  var _config = undefined;

  var _ref = function(obj, str) {
    // get dot notated value from object
    // props to: http://stackoverflow.com/questions/10934664/convert-string-in-dot-notation-to-get-the-object-reference
    str = str.split(".");
    for (var i = 0; i < str.length; i++)
      obj = obj[str[i]];
    return obj;
  };

  // "public" methods
  return {
    config: function(filename) {
      //console.log('Loading Configuration');

      _config_filename = filename;
      _config = YAML.load(filename);
      console.log(_config);
      if (_config.build.misc.print_config) {
        console.log(_config);
      }
      return _config;
    },
    getReplacePatterns: function(vars) {
      _replace_vars = vars;

      var replace_patterns = {patterns: []};

      _.each(vars, function(name) {
        replace_patterns.patterns.push({
          match: name,
          replacement: _ref(_config, name)
        })
      });

      return replace_patterns;
    }
  }
}();