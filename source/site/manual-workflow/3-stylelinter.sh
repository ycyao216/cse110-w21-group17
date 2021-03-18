#!/usr/bin/env sh
cd "$(dirname "$0")"
cd ../
export stylelint="node_modules/.bin/stylelint"
$stylelint --fix "frontend/**/*.css"