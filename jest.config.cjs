/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^react-d3-tree$': '<rootDir>/src/__mocks__/react-d3-tree.ts',
    '^@/shared/lib/supabase$': '<rootDir>/src/__mocks__/supabase.ts',
    '^@/features/auth$': '<rootDir>/src/__mocks__/auth.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  testMatch: ['**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-d3-tree|d3-selection|d3-hierarchy|d3-shape|d3-zoom|d3-brush|d3-drag|d3-interpolate|d3-color|d3-format|d3-time|d3-time-format|d3-scale|d3-path|d3-array|d3-geo|d3-quadtree|d3-random|d3-selection-multi|d3-transition|d3-voronoi|d3-ease|d3-timer|d3-force|d3-dispatch|d3-quadtree|d3-collection|d3-request|d3-voronoi|d3-zoom|d3-brush|d3-drag|d3-interpolate|d3-color|d3-format|d3-time|d3-time-format|d3-scale|d3-path|d3-array|d3-geo|d3-quadtree|d3-random|d3-selection-multi|d3-transition|d3-voronoi|d3-ease|d3-timer|d3-force|d3-dispatch|d3-quadtree|d3-collection|d3-request)/)',
  ],
}; 