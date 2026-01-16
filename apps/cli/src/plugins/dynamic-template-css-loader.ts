import type { Plugin } from "vite";

const CSS_ID = "virtual:pdflared-templates-css.css";
const INLINE_ID = "virtual:pdflared-templates-css-inline";

export const dynamicTemplateCSSLoader = (templatesFolder: string): Plugin => {
	return {
		name: "dynamic-template-css-loader",
		enforce: "pre",

		resolveId(id) {
			const [path, query] = id.split("?");

			if (path === CSS_ID || path === INLINE_ID) {
				return query ? `\0${path}?${query}` : `\0${path}`;
			}
		},

		load(id) {
			const [path] = id.split("?");

			if (path === `\0${CSS_ID}`) {
				return `
					@import "tailwindcss";
					@source "${templatesFolder}/**/*.tsx";
					@source "${templatesFolder}/*.tsx";

					body,
					html,
					#root {
						@apply size-full;
					}
				`;
			}

			if (path === `\0${INLINE_ID}`) {
				return `
					import css from "${CSS_ID}?inline"
					export default css
        		`;
			}
		},
	};
};
