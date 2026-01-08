import { templateService } from "#services/template.service";
import { $ } from "#utils/factory";
import { HttpError } from "#utils/http";
import { zValidator } from "#utils/validation";
import { templateValidators } from "#validators";

export const templateController = $.createApp()
	.put(
		"/",
		zValidator("json", templateValidators.request.put.json),
		async (c) => {
			const requestBody = c.req.valid("json");

			const createdTemplate = await templateService.createTemplate(requestBody);

			return c.json(createdTemplate, 201);
		},
	)
	.get("/", async (c) => {
		const templates = await templateService.getTemplates();

		return c.json(templates);
	})
	.get("/:templateId", async (c) => {
		const templateId = c.req.param("templateId");

		const template = await templateService.getTemplate(templateId);
		if (!template) {
			throw HttpError.notFound();
		}

		return c.json(template);
	})
	.post(
		"/:templateId/render",
		zValidator("json", templateValidators.request.render.json),
		async (c) => {
			const templateId = c.req.param("templateId");

			const requestBody = c.req.valid("json");

			const renderedTemplateVersion = await templateService.renderTemplate(
				templateId,
				requestBody,
			);

			return renderedTemplateVersion;
		},
	);
