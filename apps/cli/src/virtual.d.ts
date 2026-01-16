/** biome-ignore-all lint/style/useExportType: off */
declare module "virtual:pdflared-templates" {
	const templateNames: string[];
	const templates: Record<
		string,
		Promise<{
			Template: React.FC;
			previewVariables?: Record<string, unknown>;
			globalStyles?: string;
		}>
	>;

	export { templateNames, templates };
}
declare module "virtual:pdflared-templates-css-inline" {
	const css: string;
	export default css;
}

declare module "virtual:pdflared-builded-template" {
	const template: React.FC;
	export default template;
}
