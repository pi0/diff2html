/*
 *
 * Utils (utils.js)
 * Author: rtfpessoa
 *
 */

(function(ctx, undefined) {

  function Utils() {
  }

  Utils.prototype.escape = function(str) {
    return str.slice(0)
      .replace(regExp('&'), '&amp;')
      .replace(regExp('<'), '&lt;')
      .replace(regExp('>'), '&gt;')
      .replace(regExp('"'), '&quot;')
      .replace(regExp('\t'), '    ');
  };

  Utils.prototype.unescape = function(str) {
    return str.slice(0)
      .replace(regExp('&amp;'), '&')
      .replace(regExp('&lt;'), '<')
      .replace(regExp('&gt;'), '>')
      .replace(regExp('&quot;'), '"')
      .replace(regExp('    '), '\t');
  };

  function regExp(e) {
    return new RegExp(e, 'g');
  }

  Utils.prototype.getRandomId = function(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(-3);
  };

  Utils.prototype.startsWith = function(str, start) {
    if (typeof start === 'object') {
      var result = false;
      start.forEach(function(s) {
        if (str.indexOf(s) === 0) {
          result = true;
        }
      });

      return result;
    }

    return str.indexOf(start) === 0;
  };

  Utils.prototype.valueOrEmpty = function(value) {
    return value ? value : '';
  };

  module.exports['Utils'] = new Utils();

})(this);
