import "./style.css";

import { templateNames } from "virtual:pdflared-templates";
import { githubDarkTheme, JsonEditor } from "json-edit-react";
import { createRoot } from "react-dom/client";
import { TopBar } from "./components/top-bar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./components/ui/resizable";
import { useSearchParamState } from "./hooks/use-search-param-state";
import { cn } from "./lib/utils";
import { TemplateIframe } from "./template-iframe/template-iframe";
import { buildIframeDispatchEvent } from "./utils/events";

function App() {
	const [selected, setSelected] = useSearchParamState(
		"template",
		templateNames.at(0) ?? "",
	);

	const handleVariablesEdit = (data: { newData: unknown }) => {
		window.dispatchEvent(
			buildIframeDispatchEvent({
				type: "inject-variables",
				payload: data.newData as Record<string, unknown>,
			}),
		);
	};

	return (
		<ResizablePanelGroup className="h-screen w-full">
			<ResizablePanel defaultSize={200} minSize={200}>
				<div className="h-full flex flex-col p-2">
					{templateNames.map((templateName) => (
						<button
							className={cn(
								"px-3 py-2 text-left rounded-md text-slate-200 text-xs hover:text-primary transition-colors",
								templateName === selected && "bg-accent text-primary",
							)}
							type="button"
							key={templateName}
							onClick={() => setSelected(templateName)}
						>
							{templateName}
						</button>
					))}
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel className="bg-accent">
				<div className="flex flex-col h-full">
					<TopBar />
					<div className="flex-1 overflow-auto p-8 flex items-start justify-center">
						<TemplateIframe templateName={selected} />
					</div>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={300} minSize={300}>
				<JsonEditor
					theme={githubDarkTheme}
					onEdit={handleVariablesEdit}
					className="w-full h-full rounded-none!"
					data={{ name: "" }}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

// biome-ignore lint/style/noNonNullAssertion: Will always be defined
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
