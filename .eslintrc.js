module.exports = {
  "parser": "babel-eslint",
  "rules": {
    "strict": [
      0,
      "global"
    ],
    "indent": [
      1,
      2
    ],
    "quotes": [
      2,
      "single"
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "semi": [
      2,
      "never"
    ],
    "comma-dangle": [
      0,
      "always-multiline"
    ],
    "no-console": 0,
    "no-var": [
      2
    ],
    "no-empty": 1,
    "no-unused-vars": 1
  },
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:require-path-exists/recommended"
  ],
  "plugins": [
    "require-path-exists"
  ],
  "globals": {
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
  }
};
