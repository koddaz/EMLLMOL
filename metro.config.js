const { getDefaultConfig } = require('expo/metro-config');

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

module.exports = config;