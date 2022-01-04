module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-control-statements', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    commonjs: true,
    'jsx-control-statements/jsx-control-statements': true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    'no-console': 'off',
    'prefer-const': [
      'error',
      { destructuring: 'all', ignoreReadBeforeAssign: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-triple-slash-reference': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/triple-slash-reference': [
      'error',
      { path: 'always', types: 'never', lib: 'never' },
    ],
    // React相关校验规则
    'react/prop-types': ['off'],
    'react/jsx-indent': [2, 2],
    'react/jsx-no-undef': [2, { allowGlobals: true }],
    'jsx-control-statements/jsx-use-if-tag': 0,
  },
}
