import { createExecutionContext, env } from "cloudflare:test";
import type { InferRequestType } from "hono";
import { testClient } from "hono/testing";
import { expect } from "vitest";
import app, { type Router } from "#index";

export const executionContext = createExecutionContext();

export const client = testClient<Router>(app, env, executionContext);

export const putTemplate = async (
	options: InferRequestType<typeof client.templates.$put>,
) => {
	const response = await client.templates.$put(options, {
		headers: {
			"X-API-KEY": env.API_KEY,
		},
	});

	expect(response.status).toBe(201);

	const responseBody = await response.json();

	return responseBody;
};

export const putTemplateVersion = async (
	options: InferRequestType<
		(typeof client.templates)[":templateId"]["versions"]["$put"]
	>,
) => {
	const response = await client.templates[":templateId"].versions.$put(
		options,
		{
			headers: {
				"X-API-KEY": env.API_KEY,
			},
		},
	);

	expect(response.status).toBe(201);

	const responseBody = await response.json();

	return responseBody;
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return bytes;
};
