import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Ignore generated files and external dependencies.
  {
    ignores: [
      'dist/**',
      'lib/**',
      'coverage/**',
      'node_modules/**',
    ],
  },

  // Base JavaScript recommended rules.
  js.configs.recommended,

  // Recommended TypeScript rules that require type information.
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['src/**/*.ts'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        // Automatically discovers the appropriate tsconfig.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },

      globals: globals.node,
    },

    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },

    settings: {
      'import/resolver': {
        typescript: true,
      },
    },

    rules: {
      // Disable the JS version in favor of the TypeScript-aware rule.
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Keep imports sorted for consistency.
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // Run Prettier as part of ESLint.
      'prettier/prettier': 'error',
    },
  },

  // Disable formatting rules that conflict with Prettier.
  prettierConfig,
];