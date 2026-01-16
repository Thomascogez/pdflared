export {};

declare global {
	interface Window {
		injectTemplateVariables: (
			variables: Record<string, unknown>,
		) => void | Promise<void>;
	}

	interface GlobalEventHandlersEventMap {
		"template-iframe-dispatch": CustomEvent<
			import("./types").TemplateIframeActions
		>;
	}
}
