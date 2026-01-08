import { templateVersionService } from "#services/template-version.service";
import { $ } from "#utils/factory";
import { zValidator } from "#utils/validation";
import { templateVersionValidators } from "#validators";

export const templateVersionController = $.createApp()
	.put(
		"/:templateId/versions",
		zValidator("form", templateVersionValidators.request.put.form),
		async (c) => {
			const templateId = c.req.param("templateId");
			const requestBody = c.req.valid("form");

			const createdTemplateVersion =
				await templateVersionService.createTemplateVersion(
					templateId,
					requestBody,
				);

			return c.json(createdTemplateVersion, 201);
		},
	)
	.get("/:templateId/versions", async (c) => {
		const templateId = c.req.param("templateId");

		const templateVersions =
			await templateVersionService.getTemplateVersions(templateId);

		return c.json(templateVersions);
	});
