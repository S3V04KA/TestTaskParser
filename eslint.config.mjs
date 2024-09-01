import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { 
    languageOptions: { 
      globals: globals.browser,
    },
    rules: {
      semi: 'warning',
      quotes: ['error', 'double'],
      'prefer-const': 'warning'
    }
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier
];
