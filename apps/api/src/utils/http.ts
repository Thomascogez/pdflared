import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type ErrorPayload = {
	code?: string;
	message: string | string[] | Record<string, unknown>[];
};

export class HttpError extends HTTPException {
	constructor(code: ContentfulStatusCode, message: ErrorPayload) {
		super(code, { message: JSON.stringify(message) });
	}

	static badRequest(message?: Partial<ErrorPayload>) {
		return new HttpError(400, {
			code: "BAD_REQUEST",
			message: "Unknown error",
			...message,
		});
	}

	static unauthorized(message?: Partial<ErrorPayload>) {
		return new HttpError(401, {
			code: "UNAUTHORIZED",
			message: "Unauthorized",
			...message,
		});
	}

	static tooManyRequests(message?: Partial<ErrorPayload>) {
		return new HttpError(429, {
			code: "TOO_MANY_REQUESTS",
			message: "Too many requests",
			...message,
		});
	}

	static forbidden(message?: Partial<ErrorPayload>) {
		return new HttpError(403, {
			code: "FORBIDDEN",
			message: "Forbidden",
			...message,
		});
	}

	static conflict(message?: Partial<ErrorPayload>) {
		return new HttpError(409, {
			code: "CONFLICT",
			message: "Conflict",
			...message,
		});
	}

	static notFound(message?: Partial<ErrorPayload>) {
		return new HttpError(404, {
			code: "NOT_FOUND",
			message: "Not Found",
			...message,
		});
	}

	static unknown(message?: Partial<ErrorPayload>) {
		return new HttpError(500, {
			code: "UNKNOWN",
			message: "Unknown error",
			...message,
		});
	}

	static fromResponse(response: Response) {
		const { status, statusText } = response;

		return new HttpError(status as ContentfulStatusCode, {
			message: statusText,
		});
	}
}
