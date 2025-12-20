import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";


const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;