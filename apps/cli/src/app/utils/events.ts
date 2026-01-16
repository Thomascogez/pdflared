import type { TemplateIframeActions } from "../../types";

export const buildIframeDispatchEvent = (payload: TemplateIframeActions) => {
	return new CustomEvent("template-iframe-dispatch", { detail: payload });
};
