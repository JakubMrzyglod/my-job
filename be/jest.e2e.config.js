const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testRegex: '.e2e.test.ts$',
  globalSetup: './src/utils/test/truncateDatabase.ts',
};
