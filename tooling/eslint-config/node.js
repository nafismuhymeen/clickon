import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export const nodeConfig = tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '.turbo/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  }
);

export default nodeConfig;
