module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: false,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 5,
  },
  rules: {
    "no-var": "off",
    "prefer-const": "off",
    strict: ["error", "global"],
    // Tambahkan aturan lain sesuai kebutuhan
  },
};
