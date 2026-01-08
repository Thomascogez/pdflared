import { env } from "cloudflare:workers";
import type z from "zod";

import { db } from "#db/index";
import { templatesTable } from "#db/schemas";
import { HttpError } from "#utils/http";
import type { templateValidators } from "#validators";

export const templateService = {
	async createTemplate(
		templateInput: z.infer<typeof templateValidators.request.put.json>,
	) {
		const queryResults = await db
			.insert(templatesTable)
			.values({
				id: crypto.randomUUID(),
				name: templateInput.name,
			})
			.returning();

		const [insertedTemplate] = queryResults;
		if (!insertedTemplate) {
			throw new HttpError(500, {
				message: "Error inserting template into database",
			});
		}

		return insertedTemplate;
	},

	async getTemplates() {
		const templates = await db.query.templatesTable.findMany();

		return templates;
	},

	async getTemplate(templateId: string) {
		const template = await db.query.templatesTable.findFirst({
			where: (table, { eq }) => eq(table.id, templateId),
		});

		return template;
	},

	async renderTemplate(
		templateId: string,
		input: z.infer<typeof templateValidators.request.render.json>,
	) {
		const templateVersion = await db.query.templateVersionsTable.findFirst({
			where: (table, { eq, and }) =>
				and(
					eq(table.templateId, templateId),
					eq(table.version, input.version),
					eq(table.tag, input.tag ?? "default"),
				),
		});

		if (!templateVersion) {
			throw HttpError.notFound();
		}

		const templateContent = await env.BUCKET.get(
			`templates/${templateId}/tags/${templateVersion.tag ?? "default"}/versions/${templateVersion.version}/index.html`,
		);
		if (!templateContent) {
			throw HttpError.notFound();
		}

		const browserRenderingDoId = env.BROWSER_RENDERING_DO.idFromName("browser");
		const browserRenderingDoStub =
			env.BROWSER_RENDERING_DO.get(browserRenderingDoId);

		return browserRenderingDoStub.fetch("http://stub", {
			method: "POST",
			body: JSON.stringify({
				templateContent: await templateContent.text(),
				variables: input.variables ?? {},
			}),
		});
	},
};
