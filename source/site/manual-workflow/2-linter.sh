#!/usr/bin/env sh
cd ../
export eslint="node_modules/.bin/eslint"
$eslint frontend
$eslint backend