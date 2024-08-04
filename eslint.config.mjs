import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projects: true,
      },
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];  