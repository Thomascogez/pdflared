import { useEffect, useState } from "react";

const Template1 = () => {
	const [variable, setVariable] = useState<Record<string, unknown>>({
		name: "",
	});

	useEffect(() => {
		window.injectTemplateVariables = async (variables) => {
			setVariable(variables);
		};
	}, []);

	return (
		<div className="bg-white size-full mx-auto not-print:p-2">
			<h1>Template 1</h1>
			<span>{JSON.stringify(variable)}</span>
		</div>
	);
};

export const Template = Template1;
export const globalStyles = `
@page {
	size: A4;
	margin: 0.5cm;
}`;
