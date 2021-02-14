#!/usr/bin/env sh
cd "$(dirname "$0")"
cd ../
export eslint="node_modules/.bin/eslint"
$eslint frontend
$eslint backend