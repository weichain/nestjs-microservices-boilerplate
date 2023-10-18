module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'node_modules', 'dist', 'libs/prisma/clients'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-console': 'error',
    'no-multi-spaces': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    'prefer-spread': 'warn',
    'max-len': [
      // The maximum number of characters allowed on a single line
      'warn',
      {
        code: 140,
        ignoreComments: true,
        ignoreTrailingComments: true,
      },
    ],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'enumMember',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'interface',
        prefix: ['I'],
        format: ['PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow', // variable names start with _
        trailingUnderscore: 'forbid', // variable names end with _
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
    ],
    'no-unused-vars': 'error',
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'require-await': 'error',
  },
};
