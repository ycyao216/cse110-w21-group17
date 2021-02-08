#!/usr/bin/env sh
cd "$(dirname "$0")"
cd ../
export htmlvalidate="node_modules/.bin/html-validate"
find frontend -type f -name "*.html" -exec $htmlvalidate {} \;