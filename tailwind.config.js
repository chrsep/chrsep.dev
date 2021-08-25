module.exports = {
	mode: "jit",
	purge: ['./public/**/*.html', './src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
			},
			textColor: {
				default: '#fff',
				secondary: '#d0d0d0'
			},
			backgroundColor: {
				default: '#1a1a1a'
			}
		}
	},
	plugins: []
};
