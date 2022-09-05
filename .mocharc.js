'use strict';
require('dotenv').config();

const type = process.env.TEST_TYPE || 'unit';

module.exports = {
  diff: true,
  extensions: ['ts'],
  package: './package.json',
  slow: 75,
  timeout: 10000,
  require: ['ts-node/register'],
  spec: `src/**/__tests__/*${type}.ts`,
};
