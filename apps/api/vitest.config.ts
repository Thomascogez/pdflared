import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
	defineWorkersConfig,
	readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
	const migrationsPath = join(__dirname, "migrations");
	const migrations = await readD1Migrations(migrationsPath);

	const [validTemplateFileContent] = await Promise.all([
		readFile(join(__dirname, "__tests__", "mocks", "template.html")),
	]);

	return {
		test: {
			setupFiles: ["./__tests__/apply-migrations.ts"],
			poolOptions: {
				workers: {
					isolatedStorage: true,
					singleWorker: true,
					miniflare: {
						bindings: {
							TEST_MIGRATIONS: migrations,
							VALID_TEMPLATE_FILE_CONTENT_BASE_64:
								validTemplateFileContent.toString("base64"),
						},
					},
					wrangler: { configPath: "./wrangler.jsonc" },
				},
			},
		},
	};
});
