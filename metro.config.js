/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
module.exports = {
  watchFolders: [
    path.resolve(__dirname),        // your 'native' directory
     path.resolve(__dirname, './src'),   // your '../src' directory
   ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
