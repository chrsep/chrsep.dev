import { sveltekit } from "@sveltejs/kit/vite"
import { imagetools } from "vite-imagetools"
import svg from "@poppanator/sveltekit-svg"
import tailwindcss from "@tailwindcss/vite"

export default {
  plugins: [tailwindcss(), sveltekit(), svg(), imagetools()],
}
