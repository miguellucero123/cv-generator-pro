module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/services/linkedinService.js',
    '!src/docs/**'
  ],
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageThreshold: {
    global: {
      branches: 2,
      functions: 1,
      lines: 12,
      statements: 12
    }
  },
  testTimeout: 10000,
  verbose: false
};
