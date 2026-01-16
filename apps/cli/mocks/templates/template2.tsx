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
		<div className="bg-white size-full mx-auto">
			<h1>Template 2</h1>
			<span>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti, esse
				iste nostrum voluptates qui magni laboriosam maiores totam officia
				exercitationem vitae. Aliquid id nulla at! At ratione velit non qui!
			</span>
			<span>{JSON.stringify(variable)}</span>
		</div>
	);
};

export const Template = Template1;
