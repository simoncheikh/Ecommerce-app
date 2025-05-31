/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",  // Use ts-jest for TypeScript testing
  testEnvironment: "node",  // Run tests in a Node.js environment
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  transformIgnorePatterns: ["node_modules/(?!react-native|react-native-vision-camera|react-native-skeleton-placeholder)"]
};
