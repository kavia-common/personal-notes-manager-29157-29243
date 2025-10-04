module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.e2e.test.js'],
  // Ensure Babel is not required; project is CommonJS
  transform: {},
  // Silence unnecessary console output during tests
  verbose: false,
  // Reset mocks between tests for isolation
  resetMocks: true,
  restoreMocks: true,
};
