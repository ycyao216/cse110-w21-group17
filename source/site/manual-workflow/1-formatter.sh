#!/usr/bin/env sh
cd "$(dirname "$0")"
cd ../
export jsbeautify="node_modules/.bin/js-beautify"
find backend -type f -name "*.html" -exec $jsbeautify -r {} \;
find backend -type f -name "*.js" -exec $jsbeautify -r {} \;
find backend -type f -name "*.css" -exec $jsbeautify -r {} \;
find frontend -type f -name "*.html" -exec $jsbeautify -r {} \;
find frontend -type f -name "*.js" -exec $jsbeautify -r {} \;
find frontend -type f -name "*.css" -exec $jsbeautify -r {} \;