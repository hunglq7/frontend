import antfu from "@antfu/eslint-config";

export default antfu({
	ignores: [
		".env",
		".env.*",
		"**/*.svg",
		"**/*.code-snippets",
		".gitignore",
		".npmrc",
		".editorconfig",
		"LICENSE",
		"docs/**",
		"build/**",
		"**/*.md",
	],
	react: true,
	rules: {
		"style/quotes": ["error", "double"],
		"style/semi": ["error", "always"],
		"style/indent": ["error", "tab"],
		"jsonc/indent": ["error", "tab"],
		"style/no-tabs": "off",
		"style/jsx-indent-props": ["error", "tab"],
		"react-hooks/exhaustive-deps": "off",
	},
});
