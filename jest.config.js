module.exports = {
  preset: 'react-native',
  transform: {
    '\\.[jt]sx?': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // optional setup file
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native' +
      '|@react-native(-community)?' +
      '|@react-navigation' +
      '|@react-native-community' +
      '|@react-native-vector-icons' +
      '|react-native-count-message' +
      '|react-native-image-picker' +
      '|react-native-modal' +
      '|react-native-reanimated' +
      '|react-native-swiper' +
      '|react-native-maps' +
      ')/)'
  ],
};

