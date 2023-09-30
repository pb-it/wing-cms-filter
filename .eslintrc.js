module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: 'standard',
    //extends: "eslint:recommended",
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        "semi": [1, "always"], // "semi": [2, "never"]
        "quotes": 0, //"quotes": ["error", "double"]
        "indent": ["error", 4, { "SwitchCase": 1 }],
        //"linebreak-style": ["error", "unix"],
        "no-var": 0,
        "space-before-function-paren": 0,
        "curly": 0,
        "eqeqeq": [1, "always"],
        "quote-props": 0,

        //"comma-dangle": ["error", "always"],
        //"no-cond-assign": ["error", "always"],

        //"no-console": "off",
    }
}
