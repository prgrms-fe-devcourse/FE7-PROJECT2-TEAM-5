import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", "node_modules"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			"plugin:prettier/recommended", // prettier 통합
		],
		plugins: {
			prettier,
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			"no-undef": "error", // 정의되지 않은 변수 금지
			eqeqeq: ["error", "always"], // == 대신 === 사용
			"no-var": "error", // var 금지

			/* Prettier 연동 */
			"prettier/prettier": "error", // prettier 규칙 위반 → ESLint 에러로 표시
		},
	},
]);
