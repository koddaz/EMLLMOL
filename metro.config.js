const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Config for AI models - PyTorch/ExecuTorch and ONNX
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'bin', 'txt', 'json', // For TensorFlow.js models (keep for compatibility)
  'ptl', 'pte', // For PyTorch/ExecuTorch models
  'onnx', // For ONNX models
];

// Resolve symlinks to prevent module resolution issues
config.resolver.unstable_enableSymlinks = true;

// Handle Metro bundling edge cases
config.resolver.platforms = ['ios', 'android', 'native'];

// Transformer configuration to handle large files
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;