const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  // ponytail: jest-expo's transform only matches .[jt]sx; msw ships .mjs deps
  // (rettime, @mswjs/interceptors). Add a .mjs -> babel-jest rule alongside them.
  transform: {
    ...expoPreset.transform,
    '^.+\\.mjs$': [
      'babel-jest',
      { babelrc: false, configFile: false, presets: ['@babel/preset-env'] },
    ],
  },
  // ponytail: jest-expo resolves msw's `react-native`/`browser` export (null),
  // so point msw's entry points at its CJS build directly.
  moduleNameMapper: {
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
  },
  // Extends jest-expo's default so babel also transforms msw's ESM-only deps.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community'
    + '|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation'
    + '|@sentry/react-native|native-base|standard-navigation'
    + '|msw|@mswjs|@bundled-es-modules|until-async|rettime|@open-draft'
    + '|headers-polyfill|outvariant|strict-event-emitter|is-node-process))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/mocks/**',
  ],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 },
  },
};
