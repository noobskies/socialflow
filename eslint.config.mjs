import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Recommended rules for this project
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  globalIgnores([
    // Next.js build outputs
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Other build artifacts
    "dist/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
