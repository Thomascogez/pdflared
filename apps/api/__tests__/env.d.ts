declare module "cloudflare:test" {
	interface ProvidedEnv extends CloudflareBindings {
		TEST_MIGRATIONS: D1Migration[];
		VALID_TEMPLATE_FILE_CONTENT_BASE_64: string;
	}
}
