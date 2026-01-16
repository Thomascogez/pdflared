import { templates } from "virtual:pdflared-templates";
import css from "virtual:pdflared-templates-css-inline";
import { createRoot } from "react-dom/client";

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

// biome-ignore lint/style/noNonNullAssertion: Will always be defined
const root = createRoot(document.getElementById("root")!);

window.addEventListener("template-iframe-dispatch", async (event) => {
	if (event.detail.type === "render") {
		const template = await templates[event.detail.payload.templateName];
		if (!template) {
			return;
		}

		const { Template, globalStyles } = template;

		if (globalStyles) {
			const style = document.createElement("style");
			style.textContent = globalStyles;
			document.head.appendChild(style);
		}

		return root.render(<Template />);
	}

	if (event.detail.type === "inject-variables") {
		return window.injectTemplateVariables(event.detail.payload);
	}

	if (event.detail.type === "print") {
		return window.print();
	}
});

window.parent.postMessage({ type: "ready" }, "*");
