#!/usr/bin/env sh
cd ../
export stylelint="node_modules/.bin/stylelint"
$stylelint --fix "frontend/**/*.css"