import { readdir } from "node:fs/promises";
import { parse, resolve } from "node:path";
import type { Plugin } from "vite";

const VIRTUAL_MODULE_ID = "virtual:pdflared-templates";
const RESOLVED_ID = `\0${VIRTUAL_MODULE_ID}`;

const templateFileExtension = [".tsx", ".jsx"];

export const dynamicTemplateLoader = (templatesFolder: string): Plugin => {
	return {
		name: "dynamic-template-loader",
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) {
				return RESOLVED_ID;
			}
		},

		async load(id) {
			const templateDirContent = await readdir(templatesFolder);

			const templateFileNames = templateDirContent.filter((file) =>
				templateFileExtension.some((ext) => file.endsWith(ext)),
			);

			if (id === RESOLVED_ID) {
				return {
					code: `
						export const templateNames = [${templateFileNames
							.map((templateFileName) => `"${parse(templateFileName).name}"`)
							.toSorted()
							.join(", ")}];

						// export const templates = ${JSON.stringify(Object.fromEntries(templateFileNames.map((templateFileName) => [parse(templateFileName).name, `import('${resolve(templatesFolder, templateFileName)}').then(mod => mod.Template)`])))}

						export const templates = {
							${templateFileNames
								.map(
									(templateFileName) =>
										`${parse(templateFileName).name}: import('${resolve(templatesFolder, templateFileName)}')`,
								)
								.join(",\n")}
						};
					`,
				};
			}
		},
	};
};
