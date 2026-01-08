import { sql } from "drizzle-orm";
import { sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";

export const templatesTable = sqliteTable("templates", (table) => ({
	id: table.text("id").primaryKey(),
	name: table.text("name"),
	createdAt: table
		.integer({ mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),

	updatedAt: table
		.integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
}));

export const templateVersionsTable = sqliteTable(
	"template_versions",
	(table) => ({
		version: table.text("version").notNull(),
		templateId: table
			.text("template_id")
			.notNull()
			.references(() => templatesTable.id),
		tag: table.text("tag").default("default"),
		createdAt: table
			.integer({ mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: table
			.integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	}),
	(table) => [
		uniqueIndex("template_id_version_tag_index").on(
			table.templateId,
			table.version,
			table.tag,
		),
	],
);
