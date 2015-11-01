/*
 *
 * HtmlPrinter (html-printer.js)
 * Author: rtfpessoa
 *
 */

'use strict';

(function (ctx, undefined) {

  var lineByLinePrinter = require('./line-by-line-printer').LineByLinePrinter;
  var sideBySidePrinter = require('./side-by-side-printer').SideBySidePrinter;

  function HtmlPrinter() {}

  HtmlPrinter.prototype.generateLineByLineJsonHtml = lineByLinePrinter.generateLineByLineJsonHtml;

  HtmlPrinter.prototype.generateSideBySideJsonHtml = sideBySidePrinter.generateSideBySideJsonHtml;

  module.exports['HtmlPrinter'] = new HtmlPrinter();
})(undefined);