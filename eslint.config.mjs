import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// Remove the raw plugin import, keep the recommended config
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // 1. Use the recommended prettier config
  pluginPrettierRecommended,
  
  // 2. Explicitly tell ESLint to run Prettier on your React/TS files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // You can override specific prettier rules here if needed, 
      // but 'pluginPrettierRecommended' already sets this to 'error'
      'prettier/prettier': 'warn', 
    }
  },
  
  // Override default ignores
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;