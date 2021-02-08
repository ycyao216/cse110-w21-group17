#!/usr/bin/env sh
cd ../
export htmlvalidate="node_modules/.bin/html-validate"
find frontend -type f -name "*.html" -exec $htmlvalidate {} \;