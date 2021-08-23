const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
			},
			textColor: {
				default: '#fff',
				secondary: '#d0d0d0'
			},
			backgroundColor: {
				default: '#000'
			}
		}
	},
	plugins: []
};

module.exports = config;
