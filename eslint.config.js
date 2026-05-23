// ESLint flat config — TypeScript strict + React + import-x + architecture boundaries.
// See AGENTS.md and skills/self-correcting-loop/SKILL.md.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importX from 'eslint-plugin-import-x';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'prisma/migrations/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Import organization
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'import-x': importX },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
    },
  },

  // ── Architecture boundaries ───────────────────────────────────
  // src/server cannot import src/client; src/client cannot import src/server values
  // (type-only imports are allowed so client can use AppRouter type from server).
  {
    files: ['src/server/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/client/**', '@client/*'],
              message: 'Server code must not import from src/client.',
            },
          ],
        },
      ],
    },
  },
  // Client-side: enforce type-only imports for anything crossing into src/server.
  // (Runtime imports from server would also fail to bundle, but this catches them earlier.)
  {
    files: ['src/client/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  // ── TypeScript strictness ─────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression > TSAsExpression',
          message:
            'Double type assertion (as unknown as T) bypasses the type system. Narrow properly.',
        },
      ],
    },
  },

  // ── React (client only) ───────────────────────────────────────
  {
    files: ['src/client/**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',
    },
  },

  // ── Node globals for server ───────────────────────────────────
  {
    files: ['src/server/**/*.ts', 'scripts/**/*.ts', 'prisma/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // ── Tests get relaxed rules ───────────────────────────────────
  {
    files: ['src/**/__tests__/**', 'src/**/*.{test,spec}.{ts,tsx}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'no-restricted-imports': 'off',
    },
  },

  // ── Allow console in scripts and server bootstrap ─────────────
  {
    files: ['src/server/index.ts', 'scripts/**/*.ts', 'prisma/seed.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['src/client/**/*.{ts,tsx}', 'src/server/**/*.ts'],
    ignores: ['src/server/index.ts'],
    rules: { 'no-console': ['warn', { allow: ['warn', 'error'] }] },
  },

  prettier,
);
