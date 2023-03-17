export default {
  roots: ['<rootDir>/scr/**/*.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/scr/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
