import { run } from "@drizzle-team/brocli";
import { previewCommand } from "./commands/preview";

run([previewCommand], {
	version: "0.0.1",
});

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
