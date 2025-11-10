const path = require('path');

module.exports = {
    root: true,
    extends: [
        '@dishboard',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // integrates Prettier with ESLint
    ],
    parserOptions: {
        project: path.resolve(__dirname, 'tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2021,
    },
    env: {
        node: true,
        jest: true,
        es2021: true,
    },
    ignorePatterns: [
        'dist/',
        'node_modules/',
        '**/migrations/*.ts',
        '**/*.js',
    ],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: path.resolve(__dirname, 'tsconfig.json'),
            },
        },
    },
    rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/order': [
            'warn',
            {
                groups: [['builtin', 'external', 'internal']],
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'after',
                    },
                ],
                alphabetize: { order: 'asc', caseInsensitive: true },
                'newlines-between': 'always',
            },
        ],
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: true,
                trailingComma: 'all',
                printWidth: 100,
                tabWidth: 2,
            },
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
};
