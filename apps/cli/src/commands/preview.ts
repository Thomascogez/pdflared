import { resolve } from "node:path";
import { command, number, string } from "@drizzle-team/brocli";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { dynamicTemplateCSSLoader } from "../plugins/dynamic-template-css-loader";
import { dynamicTemplateLoader } from "../plugins/dynamic-template-loader";

export const previewCommand = command({
	name: "preview",
	desc: "Start the preview server",
	options: {
		port: number().desc("The preview server port").default(4000),
		templates: string().desc("The templates directory").default("./templates"),
	},
	transform: (options) => {
		return {
			...options,
			templates: options.templates.startsWith(process.cwd())
				? options.templates
				: resolve(process.cwd(), options.templates),
		};
	},
	handler: async (options) => {
		const server = await createServer({
			plugins: [
				react(),
				tailwindcss(),
				dynamicTemplateLoader(options.templates),
				dynamicTemplateCSSLoader(options.templates),
			],
			root: resolve(import.meta.dirname, "../app"),
		});

		await server.listen(options.port);

		server.printUrls();
	},
});
