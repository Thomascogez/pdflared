export const tryCatch = async <T>(
	promise: Promise<T>,
): Promise<[Error, undefined] | [undefined, T]> => {
	try {
		const resolvedValue = await promise;
		return [undefined, resolvedValue];
	} catch (error) {
		return [error as Error, undefined];
	}
};
