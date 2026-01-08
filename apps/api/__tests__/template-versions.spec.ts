import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import {
	base64ToUint8Array,
	client,
	putTemplate,
	putTemplateVersion,
} from "./utils";

describe("/template/:templateId/versions routes", () => {
	describe("PUT /template/:templateId/versions", () => {
		it("should not put a new template version without an api key header", async () => {
			const response = await client.templates[":templateId"].versions.$put({
				param: {
					templateId: crypto.randomUUID(),
				},
				form: {
					templateFile: new File(
						[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
						"template.html",
						{ type: "text/html" },
					),
					version: "1.0.0",
				},
			});

			expect(response.status).toBe(401);
		});

		it("should not put a new template version with an invalid api key", async () => {
			const response = await client.templates[":templateId"].versions.$put(
				{
					param: {
						templateId: crypto.randomUUID(),
					},
					form: {
						templateFile: new File(
							[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
							"template.html",
							{ type: "text/html" },
						),
						version: "1.0.0",
					},
				},
				{
					headers: {
						"X-API-KEY": "invalid-api-key",
					},
				},
			);

			expect(response.status).toBe(401);
		});

		it("should not upload a template version with an invalid semver version", async () => {
			const response = await client.templates[":templateId"].versions.$put(
				{
					param: {
						templateId: crypto.randomUUID(),
					},
					form: {
						templateFile: new File(
							[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
							"template.html",
							{ type: "text/html" },
						),
						version: "not.a.semver",
					},
				},
				{
					headers: {
						"X-API-KEY": env.API_KEY,
					},
				},
			);

			expect(response.status).toBe(400);

			const responseBody = await response.json();

			expect(responseBody).to.have.property("code", "BAD_REQUEST");
			expect(responseBody).to.have.property(
				"message",
				"Version must be a valid semver string",
			);
		});

		it("should not upload a template version with an invalid template file", async () => {
			const response = await client.templates[":templateId"].versions.$put(
				{
					param: {
						templateId: crypto.randomUUID(),
					},
					form: {
						templateFile: new File(
							[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
							"template.txt",
							{ type: "text/plain" },
						),
						version: "1.0.0",
					},
				},
				{
					headers: {
						"X-API-KEY": env.API_KEY,
					},
				},
			);

			expect(response.status).toBe(400);

			const responseBody = await response.json();

			expect(responseBody).to.have.property("code", "BAD_REQUEST");
			expect(responseBody).to.have.property(
				"message",
				"File type must be one of the following: text/html",
			);
		});

		it("should not upload a template version to a non-existing template", async () => {
			const response = await client.templates[":templateId"].versions.$put(
				{
					param: {
						templateId: crypto.randomUUID(),
					},
					form: {
						templateFile: new File(
							[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
							"template.html",
							{ type: "text/html" },
						),
						version: "1.0.0",
					},
				},
				{
					headers: {
						"X-API-KEY": env.API_KEY,
					},
				},
			);

			expect(response.status).toBe(404);

			const responseBody = await response.json();

			expect(responseBody).to.have.property("code", "NOT_FOUND");
			expect(responseBody).to.have.property("message", "Template not found");
		});

		it("should upload a template version", async () => {
			const template = await putTemplate({ json: { name: "test-template" } });

			const response = await client.templates[":templateId"].versions.$put(
				{
					param: {
						templateId: template.id,
					},
					form: {
						templateFile: new File(
							[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
							"template.html",
							{ type: "text/html" },
						),
						version: "1.0.0",
					},
				},
				{
					headers: {
						"X-API-KEY": env.API_KEY,
					},
				},
			);

			expect(response.status).toBe(201);

			const responseBody = await response.json();

			expect(responseBody.version).toBe("1.0.0");
			expect(responseBody.templateId).toBe(template.id);
			expect(responseBody.createdAt).to.be.a("string");
			expect(responseBody.updatedAt).to.be.a("string");
		});

		it("should not upload a template version that already exists", async () => {
			const template = await putTemplate({ json: { name: "test-template" } });

			const requestBody = {
				param: {
					templateId: template.id,
				},
				form: {
					templateFile: new File(
						[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
						"template.html",
						{ type: "text/html" },
					),
					version: "1.0.0",
				},
			};

			await client.templates[":templateId"].versions.$put(requestBody, {
				headers: {
					"X-API-KEY": env.API_KEY,
				},
			});

			const response = await client.templates[":templateId"].versions.$put(
				requestBody,
				{
					headers: {
						"X-API-KEY": env.API_KEY,
					},
				},
			);

			expect(response.status).toBe(409);

			const responseBody = await response.json();

			expect(responseBody).to.have.property(
				"code",
				"TEMPLATE_VERSION_ALREADY_EXISTS",
			);
			expect(responseBody).to.have.property(
				"message",
				`Template with version 1.0.0 already exists`,
			);
		});
	});

	describe("GET /template/:templateId/versions", () => {
		it("should not get a list of template versions without an api key header", async () => {
			const response = await client.templates[":templateId"].versions.$get({
				param: { templateId: crypto.randomUUID() },
			});

			expect(response.status).toBe(401);
		});

		it("should not get a list of template versions with an invalid api key", async () => {
			const response = await client.templates[":templateId"].versions.$get(
				{
					param: { templateId: crypto.randomUUID() },
				},
				{
					headers: {
						"X-API-KEY": "invalid-api-key",
					},
				},
			);

			expect(response.status).toBe(401);
		});

		it("should get a list of template versions", async () => {
			const template = await putTemplate({ json: { name: "test-template" } });
			const templateVersion = await putTemplateVersion({
				param: { templateId: template.id },
				form: {
					templateFile: new File(
						[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
						"template.html",
						{ type: "text/html" },
					),
					version: "1.0.0",
				},
			});
			const templateVersionCustomTag = await putTemplateVersion({
				param: { templateId: template.id },
				form: {
					tag: "test",
					templateFile: new File(
						[base64ToUint8Array(env.VALID_TEMPLATE_FILE_CONTENT_BASE_64)],
						"template.html",
						{ type: "text/html" },
					),
					version: "1.0.0",
				},
			});

			const response = await client.templates[":templateId"].versions.$get(
				{
					param: { templateId: template.id },
				},
				{
					headers: {
						"X-API-KEY": env.API_KEY,
					},
				},
			);

			expect(response.status).toBe(200);

			const responseBody = await response.json();

			expect(responseBody).to.have.property("default");
			expect(responseBody.default).to.be.an("array").toHaveLength(1);

			expect(responseBody.default?.at(0)).to.have.property(
				"version",
				templateVersion.version,
			);
			expect(responseBody.default?.at(0)).to.have.property(
				"templateId",
				template.id,
			);
			expect(responseBody.default?.at(0)).to.have.property(
				"tag",
				templateVersion.tag,
			);
			expect(responseBody.default?.at(0)).to.have.property(
				"createdAt",
				templateVersion.createdAt,
			);
			expect(responseBody.default?.at(0)).to.have.property(
				"updatedAt",
				templateVersion.updatedAt,
			);

			expect(responseBody).to.have.property("test");
			expect(responseBody.test).to.be.an("array").toHaveLength(1);

			expect(responseBody.test?.at(0)).to.have.property(
				"version",
				templateVersionCustomTag.version,
			);
			expect(responseBody.test?.at(0)).to.have.property(
				"templateId",
				template.id,
			);
			expect(responseBody.test?.at(0)).to.have.property(
				"tag",
				templateVersionCustomTag.tag,
			);
			expect(responseBody.test?.at(0)).to.have.property(
				"createdAt",
				templateVersionCustomTag.createdAt,
			);
			expect(responseBody.test?.at(0)).to.have.property(
				"updatedAt",
				templateVersionCustomTag.updatedAt,
			);
		});
	});
});
