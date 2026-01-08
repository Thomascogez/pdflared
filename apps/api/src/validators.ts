import { z } from "zod";
import {
	MAX_TEMPLATE_FILE_SIZE,
	TEMPLATE_FILE_ALLOWED_FILE_TYPES,
} from "#constants/files";

const SEMVER_STRING_REGEX =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const templateValidators = {
	request: {
		put: {
			json: z.object({
				name: z.string().nonempty().max(255),
			}),
		},
		render: {
			json: z.object({
				version: z.string().regex(SEMVER_STRING_REGEX, {
					error: "Version must be a valid semver string",
				}),
				tag: z.string().nonempty().max(255).optional(),
				variables: z.record(z.string(), z.any()).optional(),
			}),
		},
	},
};

export const templateVersionValidators = {
	request: {
		put: {
			form: z.object({
				version: z.string().regex(SEMVER_STRING_REGEX, {
					error: "Version must be a valid semver string",
				}),
				tag: z.string().nonempty().max(255).optional(),
				templateFile: z
					.instanceof(File)
					.refine((file) => file.size <= MAX_TEMPLATE_FILE_SIZE, {
						error: "File size must be less than 10MB",
					})
					.refine(
						(file) => TEMPLATE_FILE_ALLOWED_FILE_TYPES.includes(file.type),
						{
							error: `File type must be one of the following: ${TEMPLATE_FILE_ALLOWED_FILE_TYPES.join(", ")}`,
						},
					),
			}),
		},
	},
};
