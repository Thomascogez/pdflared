import { env } from "cloudflare:workers";
import { DrizzleQueryError } from "drizzle-orm";
import type z from "zod";

import { db } from "#db/index";
import { templateVersionsTable } from "#db/schemas";
import { tryCatch } from "#utils/common";
import { HttpError } from "#utils/http";
import type { templateVersionValidators } from "#validators";

export const templateVersionService = {
	async createTemplateVersion(
		templateId: string,
		templateVersionInput: z.infer<
			typeof templateVersionValidators.request.put.form
		>,
	) {
		const [queryError, queryResults] = await tryCatch(
			db
				.insert(templateVersionsTable)
				.values({
					version: templateVersionInput.version,
					templateId,
					tag: templateVersionInput.tag,
				})
				.returning(),
		);

		if (queryError) {
			if (queryError instanceof DrizzleQueryError) {
				if (
					queryError.cause?.message.includes("FOREIGN KEY constraint failed")
				) {
					throw HttpError.notFound({
						message: "Template not found",
					});
				}

				if (queryError.cause?.message.includes("UNIQUE constraint failed")) {
					throw HttpError.conflict({
						code: "TEMPLATE_VERSION_ALREADY_EXISTS",
						message: `Template with version ${templateVersionInput.version} already exists`,
					});
				}
			}

			throw HttpError.unknown({
				message: "Error inserting template version into database",
			});
		}

		const [insertedTemplateVersion] = queryResults;
		if (!insertedTemplateVersion) {
			throw new HttpError(500, {
				message: "Error inserting template version into database",
			});
		}

		const storageKey = `templates/${templateId}/tags/${insertedTemplateVersion.tag ?? "default"}/versions/${insertedTemplateVersion.version}/index.html`;

		await env.BUCKET.put(
			storageKey,
			templateVersionInput.templateFile.stream(),
			{
				httpMetadata: { contentType: templateVersionInput.templateFile.type },
			},
		);

		return insertedTemplateVersion;
	},

	async getTemplateVersions(templateId: string) {
		const templateVersions = await db.query.templateVersionsTable.findMany({
			where: (table, { eq }) => eq(table.templateId, templateId),
			orderBy: (table, { asc }) => asc(table.version),
		});

		const versionsGroupedByTags = Object.groupBy(
			templateVersions,
			(version) => version.tag ?? "default",
		);

		return versionsGroupedByTags;
	},
};
