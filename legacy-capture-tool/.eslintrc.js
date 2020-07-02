module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true
	},
	extends: [
		'@holistic-web/eslint-config'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 11
	},
	rules: {
		'max-len': 180
	}
};
