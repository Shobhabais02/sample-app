module.exports = {
    preset: 'jest-expo',
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest', 
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-redux|redux-mock-store|expo|@expo|react-native)/)',
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  };
  