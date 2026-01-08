import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	out: "./migrations",
	schema: ["./src/db/schemas.ts"],
	driver: "d1-http",
});
