/*
 *
 * LineByLinePrinter (line-by-line-printer.js)
 * Author: rtfpessoa
 *
 */

(function(ctx, undefined) {

  var React = require('react');
  var ReactDOMServer = require('react-dom/server');

  var diffParser = require('./diff-parser').DiffParser;
  var printerUtils = require('./printer-utils').PrinterUtils;
  var utils = require('./utils').Utils;

  function LineByLinePrinter() {
  }

  LineByLinePrinter.prototype.generateLineByLineJsonHtml = function(diffFiles, config) {
    return '<div class="d2h-wrapper">\n' +
      diffFiles.map(function(file) {

        var diffs;
        if (file.blocks.length) {
          diffs = generateFileHtml(file, config);
        } else {
          diffs = generateEmptyDiff();
        }

        var FileElement = React.createClass({
          render: function() {
            return (
              <div id={printerUtils.getHtmlId(file)} className="d2h-file-wrapper" data-lang={file.language}>
                <div className="d2h-file-header">
                  <div className="d2h-file-stats">
                   <span className="d2h-lines-added">
                     <span>+{file.addedLines}</span>
                   </span>
                   <span className="d2h-lines-deleted">
                     <span>-{file.deletedLines}</span>
                   </span>
                  </div>
                  <div className="d2h-file-name">{printerUtils.getDiffName(file)}</div>
                </div>
                <div className="d2h-file-diff">
                  <div className="d2h-code-wrapper">
                    <table className="d2h-diff-table">
                      <tbody className="d2h-diff-tbody">
                      {diffs}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          }
        });

        return utils.unescape(ReactDOMServer.renderToStaticMarkup(<FileElement />));
      }).join('\n') +
      '</div>\n';
  };

  function generateFileHtml(file, config) {
    return file.blocks.map(function(block) {

      var lines = '<tr>\n' +
        '  <td class="d2h-code-linenumber ' + diffParser.LINE_TYPE.INFO + '"></td>\n' +
        '  <td class="' + diffParser.LINE_TYPE.INFO + '">' +
        '    <div class="d2h-code-line ' + diffParser.LINE_TYPE.INFO + '">' + utils.escape(block.header) + '</div>' +
        '  </td>\n' +
        '</tr>\n';

      var oldLines = [];
      var newLines = [];
      var processedOldLines = [];
      var processedNewLines = [];

      for (var i = 0; i < block.lines.length; i++) {
        var line = block.lines[i];
        var escapedLine = utils.escape(line.content);

        if (line.type == diffParser.LINE_TYPE.CONTEXT && !oldLines.length && !newLines.length) {
          lines += generateLineHtml(line.type, line.oldNumber, line.newNumber, escapedLine);
        } else if (line.type == diffParser.LINE_TYPE.INSERTS && !oldLines.length && !newLines.length) {
          lines += generateLineHtml(line.type, line.oldNumber, line.newNumber, escapedLine);
        } else if (line.type == diffParser.LINE_TYPE.DELETES && !newLines.length) {
          oldLines.push(line);
        } else if (line.type == diffParser.LINE_TYPE.INSERTS && oldLines.length > newLines.length) {
          newLines.push(line);
        } else {
          var oldLine, newLine;

          if (oldLines.length === newLines.length) {
            for (var j = 0; j < oldLines.length; j++) {
              oldLine = oldLines[j];
              newLine = newLines[j];

              config.isCombined = file.isCombined;
              var diff = printerUtils.diffHighlight(oldLine.content, newLine.content, config);

              processedOldLines +=
                generateLineHtml(oldLine.type, oldLine.oldNumber, oldLine.newNumber,
                  diff.first.line, diff.first.prefix);
              processedNewLines +=
                generateLineHtml(newLine.type, newLine.oldNumber, newLine.newNumber,
                  diff.second.line, diff.second.prefix);
            }

            lines += processedOldLines + processedNewLines;
          } else {
            lines += processLines(oldLines, newLines);
          }

          oldLines = [];
          newLines = [];
          processedOldLines = [];
          processedNewLines = [];
          i--;
        }
      }

      lines += processLines(oldLines, newLines);

      return lines;
    }).join('\n');
  }

  function processLines(oldLines, newLines) {
    var lines = '';

    for (var i = 0; i < oldLines.length; i++) {
      var oldLine = oldLines[i];
      var oldEscapedLine = utils.escape(oldLine.content);
      lines += generateLineHtml(oldLine.type, oldLine.oldNumber, oldLine.newNumber, oldEscapedLine);
    }

    for (var j = 0; j < newLines.length; j++) {
      var newLine = newLines[j];
      var newEscapedLine = utils.escape(newLine.content);
      lines += generateLineHtml(newLine.type, newLine.oldNumber, newLine.newNumber, newEscapedLine);
    }

    return lines;
  }

  function generateLineHtml(type, oldNumber, newNumber, content, prefix) {
    var htmlPrefix = '';
    if (prefix) {
      htmlPrefix = '<span class="d2h-code-line-prefix">' + prefix + '</span>';
    }

    var htmlContent = '';
    if (content) {
      htmlContent = '<span class="d2h-code-line-ctn">' + content + '</span>';
    }

    return '<tr>\n' +
      '  <td class="d2h-code-linenumber ' + type + '">' +
      '    <div class="line-num1">' + utils.valueOrEmpty(oldNumber) + '</div>' +
      '    <div class="line-num2">' + utils.valueOrEmpty(newNumber) + '</div>' +
      '  </td>\n' +
      '  <td class="' + type + '">' +
      '    <div class="d2h-code-line ' + type + '">' + htmlPrefix + htmlContent + '</div>' +
      '  </td>\n' +
      '</tr>\n';
  }

  function generateEmptyDiff() {
    return '<tr>\n' +
      '  <td class="' + diffParser.LINE_TYPE.INFO + '">' +
      '    <div class="d2h-code-line ' + diffParser.LINE_TYPE.INFO + '">' +
      'File without changes' +
      '    </div>' +
      '  </td>\n' +
      '</tr>\n';
  }

  module.exports['LineByLinePrinter'] = new LineByLinePrinter();

})(this);
