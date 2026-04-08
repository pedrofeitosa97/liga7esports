import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

// Use test tsconfig so jest globals are typed in test files
process.env.TS_JEST_TSCONFIG = './tsconfig.test.json';

const config: Config = {
  displayName: 'frontend',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};

export default createJestConfig(config);
