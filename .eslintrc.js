module.exports = {
  extends: ["airbnb", "airbnb-typescript", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
  },
  ignorePatterns: [".eslintrc.js"],
};
