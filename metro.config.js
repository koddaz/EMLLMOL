const { getDefaultConfig } = require('expo/metro-config');

<<<<<<< HEAD
const config = getDefaultConfig(__dirname);

// Add support for .pte files
config.resolver.assetExts.push('pte');

// Ensure assets are properly handled
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
=======
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add ONNX file support
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'onnx'
];

// Configure for ONNX Runtime compatibility
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  './node_modules'
];

// Add resolver for Node.js polyfills needed by ONNX Runtime
config.resolver.alias = {
  ...config.resolver.alias,
  'crypto': 'react-native-crypto-js',
  'stream': 'readable-stream',
  'buffer': 'buffer',
  'process': 'process/browser',
  'util': 'util'
};
>>>>>>> 25955e9 (Working!)

module.exports = config;