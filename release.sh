#!/bin/bash

#
# diff2html release script
# by rtfpessoa
#

set -e

OUTPUT_DIR_BROWSER=dist
OUTPUT_DIR_NPM=build

echo "Creating diff2html release ..."

echo "Cleaning previous versions ..."
rm -rf ${OUTPUT_DIR_BROWSER} ${OUTPUT_DIR_NPM}
mkdir -p ${OUTPUT_DIR_BROWSER}
mkdir -p ${OUTPUT_DIR_NPM}

echo "Preparing browser release..."

OUTPUT_JS_FILE=${OUTPUT_DIR_BROWSER}/diff2html.js
OUTPUT_MIN_JS_FILE=${OUTPUT_DIR_BROWSER}/diff2html.min.js
OUTPUT_CSS_FILE=${OUTPUT_DIR_BROWSER}/diff2html.css
OUTPUT_MIN_CSS_FILE=${OUTPUT_DIR_BROWSER}/diff2html.min.css

echo "Generating js aggregation file in ${OUTPUT_JS_FILE}"

browserify -d -e src/diff2html.js --extension=.jsx -t [ reactify ] -o ${OUTPUT_JS_FILE}

echo "Minifying ${OUTPUT_JS_FILE} to ${OUTPUT_MIN_JS_FILE}"

uglifyjs ${OUTPUT_JS_FILE} -c -o ${OUTPUT_MIN_JS_FILE}

echo "Copying css file to ${OUTPUT_CSS_FILE}"

cp -f css/diff2html.css ${OUTPUT_CSS_FILE}

echo "Minifying ${OUTPUT_CSS_FILE} to ${OUTPUT_MIN_CSS_FILE}"

cleancss --advanced --compatibility=ie8 -o ${OUTPUT_MIN_CSS_FILE} ${OUTPUT_CSS_FILE}

echo "Preparing npm release..."

echo "Building jsx from 'src' to 'build'"

babel src --out-dir ${OUTPUT_DIR_NPM}

echo "diff2html release created successfully!"
