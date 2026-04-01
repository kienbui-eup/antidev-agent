import tseslint from 'typescript-eslint';

export default [
    {
        ignores: [
            'node_modules/',
            'dist/',
            'browse/dist/',
            '.bun-build/',
            '.antidev/',
            'coverage/',
        ],
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Bun: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            'no-debugger': 'error',
        },
    },
];
