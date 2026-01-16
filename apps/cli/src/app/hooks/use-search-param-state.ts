import { useState } from "react";

export const useSearchParamState = (
	key: string,
	defaultValue: string,
): [string, (value: string) => void] => {
	const [state, _setState] = useState(() => {
		const url = new URL(window.location.href);
		const value = url.searchParams.get(key);
		return value ?? defaultValue;
	});

	const setState = (value: string) => {
		const url = new URL(window.location.href);
		url.searchParams.set(key, value);
		window.history.pushState({}, "", url.toString());
		_setState(value);
	};

	return [state, setState];
};
