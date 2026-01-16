import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { dynamicTemplateCSSLoader } from "./plugins/dynamic-template-css-loader";
import { dynamicTemplateLoader } from "./plugins/dynamic-template-loader";

const server = await createServer({
	plugins: [
		react(),
		tailwindcss(),
		dynamicTemplateLoader(resolve(import.meta.dirname, "../mocks/templates")),
		dynamicTemplateCSSLoader(
			resolve(import.meta.dirname, "../mocks/templates"),
		),
	],
	root: resolve(import.meta.dirname, "./app"),
});

await server.listen();

server.printUrls();

// const VIRTUAL_MODULE_ID = "virtual:pdflared-builded-template";
// const RESOLVED_ID = `\0${VIRTUAL_MODULE_ID}`;

// console.log( resolve(import.meta.dirname, "./build/index.html"));

// const builder = await createBuilder({
// 	// base: resolve(import.meta.dirname, "./build"),
// 	root: resolve(import.meta.dirname, "./build"),
// 	plugins: [
// 		react(),
// 		tailwindcss(),
// 		{
// 			name: "load-templates",
// 			resolveId(id) {
// 				if (id === VIRTUAL_MODULE_ID) {
// 					return RESOLVED_ID;
// 				}
// 			},

// 			load(id) {
// 				if (id === RESOLVED_ID) {
// 					return {
// 						code: `
// 							import BuildedTemplate from "${resolve(import.meta.dirname, "../mocks/templates/template1.tsx")}";
// 							export default BuildedTemplate;
// 						`,
// 					};
// 				}
// 			},
// 		},
// 		viteSingleFile(),
// 	],
// });

// await builder.buildApp()
