module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@controllers/(.*)$': '<rootDir>/src/app/controllers/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest'],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
