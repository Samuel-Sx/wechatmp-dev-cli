const path = require('path');

module.exports = {
  parser: 'postcss-less-engine',
  plugins: {
    'postcss-url': {
      url: 'inline', // inline image to base64
    },
  },
};