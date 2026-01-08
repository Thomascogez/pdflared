import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { client, putTemplate } from "./utils";

describe("/templates routes", () => {
	describe("PUT /templates", () => {
		it("should not put a new template without an api key header", async () => {
			const response = await client.templates.$put({
				json: {
					name: "test",
				},
			});

			expect(response.status).toBe(401);
		});

		it("should not put a new template with an invalid api key", async () => {
			const response = await client.templates.$put(
				{
					json: {
						name: "test",
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

		it("should put a new template with a valid api key", async () => {
			const response = await client.templates.$put(
				{
					json: {
						name: "test",
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

			expect(responseBody.id).to.be.a("string");
			expect(responseBody.name).toBe(responseBody.name);
			expect(responseBody.createdAt).to.be.a("string");
			expect(responseBody.updatedAt).to.be.a("string");
		});
	});

	describe("GET /templates/", () => {
		it("should not get a templates without an api key header", async () => {
			const response = await client.templates.$get();

			expect(response.status).toBe(401);
		});

		it("should not get a templates with an invalid api key", async () => {
			const response = await client.templates.$get(undefined, {
				headers: {
					"X-API-KEY": "invalid-api-key",
				},
			});

			expect(response.status).toBe(401);
		});

		it("should get a list of templates", async () => {
			const template = await putTemplate({ json: { name: "test-template" } });

			const response = await client.templates.$get(undefined, {
				headers: {
					"X-API-KEY": env.API_KEY,
				},
			});

			expect(response.status).toBe(200);

			const responseBody = await response.json();

			expect(responseBody.length).toBe(1);

			expect(responseBody[0]?.id).toBe(template.id);
			expect(responseBody[0]?.name).toBe(template.name);
			expect(responseBody[0]?.createdAt).toBe(template.createdAt);
			expect(responseBody[0]?.updatedAt).toBe(template.updatedAt);
		});
	});
});
