export type TemplateIframeActions =
	| {
			type: "render";
			payload: {
				templateName: string;
			};
	  }
	| {
			type: "print";
	  }
	| {
			type: "inject-variables";
			payload: Record<string, unknown>;
	  };
