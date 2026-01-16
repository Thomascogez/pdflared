import { useEffect, useRef } from "react";
import { buildIframeDispatchEvent } from "../utils/events";

export function TemplateIframe({ templateName }: { templateName: string }) {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) {
			return;
		}

		// Reload iframe on template change
		iframe.src = "/template-iframe.html";

		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "ready") {
				iframe.contentWindow?.dispatchEvent(
					buildIframeDispatchEvent({
						type: "render",
						payload: { templateName },
					}),
				);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [templateName]);

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) {
			return;
		}

		window.addEventListener("template-iframe-dispatch", (message) => {
			iframe.contentWindow?.dispatchEvent(
				buildIframeDispatchEvent(message.detail),
			);
		});
	}, []);
	return (
		<>
			{/* <button onClick={() => iframeRef.current?.contentWindow?.postMessage()}>Print</button> */}
			<iframe
				title="template preview"
				ref={iframeRef}
				className="shadow-xl"
				style={{
					border: 0,
					width: `${210 * 3.78 * (100 / 100)}px`, // 210mm to px at 96dpi
					height: `${297 * 3.78 * (100 / 100)}px`, // 297mm to px at 96dpi
					transform: `scale(1)`,
				}}
			/>
		</>
	);
}
