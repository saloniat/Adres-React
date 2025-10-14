module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended', // Basic JavaScript rules
      'plugin:react/recommended', // React-specific linting rules
      'plugin:react-hooks/recommended', // Hooks-specific linting rules
      'plugin:jsx-a11y/recommended', // Accessibility linting rules
      'prettier', // Disables ESLint rules that conflict with Prettier
    ],
    plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      // ESLint Rules
      'react/prop-types': 'off', // Disable PropTypes if you're using TypeScript
      'no-unused-vars': ['warn'], // Warn for unused variables
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+
      // Prettier Integration
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: false,
          jsxSingleQuote: false,
          trailingComma: 'es5',
          tabWidth: 4,
          bracketSpacing: true,
          jsxBracketSameLine: false,
          printWidth: 80,
          arrowParens: 'always',
        },
      ],
    },
  };
  