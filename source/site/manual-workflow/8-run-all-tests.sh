#!/usr/bin/env sh
cd "$(dirname "$0")"
cd ../

# clean
rm -r coverage
mkdir coverage

# # jest
npm test --coverage

# cypress remember to change timer.html /js/timer.js -> /js-trans/timer.js
npx nyc instrument --compact=false frontend/js/ frontend/js-trans
./node_modules/.bin/cypress run

# merge reports
mkdir coverage/merged-coverage
mv coverage/jest-coverage/coverage-final.json coverage/merged-coverage/coverage-jest.json
mv coverage/cypress-coverage/coverage-final.json coverage/merged-coverage/coverage-cypress.json
npx nyc merge coverage/merged-coverage
npx nyc report --reporter lcov --report-dir coverage/merged-coverage