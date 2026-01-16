export {};

declare global {
	interface Window {
		injectTemplateVariables: (
			variables: Record<string, unknown>,
		) => void | Promise<void>;
	}
}
