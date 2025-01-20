module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/core/useCases/**/*.useCase.ts'
  ],
  coverageDirectory: '__tests__/coverage',
  coverageReporters: [
    'json',
    'lcov'
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@domain/(.*)$': '<rootDir>/src/core/domain/$1',
    '^@entities/(.*)$': '<rootDir>/src/app/domain/entities/$1',
    '^@env/(.*)$': '<rootDir>/src/config/env/$1',
  },
  preset: 'ts-jest',
  setupFiles: ['<rootDir>__tests__/testSetup.ts'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>__tests__/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest'],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
