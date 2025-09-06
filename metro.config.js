const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .pte files
config.resolver.assetExts.push('pte');

// Ensure assets are properly handled
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;