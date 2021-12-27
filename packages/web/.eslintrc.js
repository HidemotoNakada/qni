module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
