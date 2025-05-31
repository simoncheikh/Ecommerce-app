module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    'module:@react-native/babel-preset'
  ],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
    'react-native-reanimated/plugin',
  ],
};
