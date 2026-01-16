import { defineConfig } from "tsdown/config";

export default defineConfig({
	entry: ["./src/index.ts"],
	outDir: "dist",
	clean: true,
	copy: [{ from: "./src/app", to: "dist", verbose: true }],
});
