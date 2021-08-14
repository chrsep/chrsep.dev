const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
		  colors: {
		    "default-background": "#000",
				"default-text": "#fff"
			}
    }
	},
	plugins: []
};

module.exports = config;
