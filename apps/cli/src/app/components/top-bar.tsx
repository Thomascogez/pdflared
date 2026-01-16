import { Printer } from "lucide-react";
import { buildIframeDispatchEvent } from "../utils/events";
import { Button } from "./ui/button";

export const TopBar: React.FC = () => {
	const handlePrintButtonClick = () => {
		window.dispatchEvent(
			buildIframeDispatchEvent({
				type: "print",
			}),
		);
	};

	return (
		<div className="flex items-center justify-between h-16 px-4 py-8 bg-background text-slate-200 sticky top-0 z-10">
			<div className="flex items-center">
				<span className="text-xl font-bold">PDFLared</span>
			</div>
			<div className="flex gap-2">
				<Button size="sm" onClick={handlePrintButtonClick}>
					<Printer /> Test Print
				</Button>
			</div>
		</div>
	);
};
