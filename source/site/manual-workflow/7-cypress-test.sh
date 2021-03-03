#!/usr/bin/env sh
cd "$(dirname "$0")"
cd ../
npx nyc instrument --compact=false frontend/js/ frontend/js-trans
./node_modules/.bin/cypress open