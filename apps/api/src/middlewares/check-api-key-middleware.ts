import { $ } from "#utils/factory";

export const checkApiKeyMiddleware = $.createMiddleware(async (c, next) => {
	const apiKey = c.req.header("X-API-Key");
	if (!apiKey || apiKey !== c.env.API_KEY) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	await next();
});
