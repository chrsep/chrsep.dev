import preprocess from 'svelte-preprocess';
import adapterStatic from '@sveltejs/adapter-static';
import { windi } from 'svelte-windicss-preprocess';

/** @type {import("@sveltejs/kit").Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({ postcss: true }),
		windi({
			configPath: 'windi.config.js',
			disableFormatter: true
		})
	],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapterStatic()
	}
};

export default config;
