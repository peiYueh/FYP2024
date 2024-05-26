// Import the getDefaultConfig function from 'expo/metro-config'
const { getDefaultConfig } = require('expo/metro-config');

// Get the default configuration using getDefaultConfig and pass __dirname
const defaultConfig = getDefaultConfig(__dirname);

// Destructure the transformer and resolver objects from the default configuration
const { transformer, resolver } = defaultConfig;

// Modify the transformer object to include the babelTransformerPath for react-native-svg
const modifiedTransformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// Modify the resolver object to include SVG as a source extension and exclude it from asset extensions
const modifiedResolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// Combine the modified transformer and resolver objects into a new configuration
const modifiedConfig = {
  ...defaultConfig,
  transformer: modifiedTransformer,
  resolver: modifiedResolver,
};

// Export the modified configuration
module.exports = modifiedConfig;