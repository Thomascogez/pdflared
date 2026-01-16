import { DurableObject } from "cloudflare:workers";
import puppeteer, { type Browser } from "@cloudflare/puppeteer";
import { z } from "zod";

const requestSchema = z.object({
	templateContent: z.string().nonempty(),
	variables: z.record(z.string(), z.any()),
});

const BROWSER_TTL_IN_SECONDS = 60;

export class BrowserRenderingDo extends DurableObject<CloudflareBindings> {
	#browser: Browser | undefined;
	#keptAliveInSeconds: number = 0;

	async #ensureBrowser() {
		if (!this.#browser || !this.#browser?.connected) {
			//@ts-expect-error
			this.#browser = await puppeteer.launch(this.env.BROWSER);
		}

		return this.#browser;
	}

	override async fetch(request: Request): Promise<Response> {
		const requestBody = await request.json();

		const { error: requestBodyValidationError, data: validatedRequestBody } =
			requestSchema.safeParse(requestBody);

		if (requestBodyValidationError) {
			return new Response(
				JSON.stringify({
					code: "BAD_REQUEST",
					message:
						requestBodyValidationError.issues.flat().at(0)?.message ??
						"Unknown error",
				}),
				{
					status: 400,
				},
			);
		}

		this.#keptAliveInSeconds = 0;

		const browser = await this.#ensureBrowser();

		const context = await browser.createBrowserContext();
		const page = await context.newPage();

		await page.setContent(validatedRequestBody.templateContent);

		await page.evaluate(async (variables) => {
			//@ts-expect-error
			const templateVariableInjectFn = window.injectTemplateVariables;

			if (typeof templateVariableInjectFn !== "function") {
				return;
			}

			await templateVariableInjectFn(variables);
		}, validatedRequestBody.variables ?? {});

		const pdf = await page.pdf();

		await context.close();
		this.#keptAliveInSeconds = 0;

		const currentAlarm = await this.ctx.storage.getAlarm();
		if (currentAlarm == null) {
			const TEN_SECONDS = 10 * 1000;
			await this.ctx.storage.setAlarm(Date.now() + TEN_SECONDS);
		}

		return new Response(pdf, {
			headers: { "Content-Type": "application/pdf" },
		});
	}

	override async alarm() {
		this.#keptAliveInSeconds += 10;

		if (this.#keptAliveInSeconds < BROWSER_TTL_IN_SECONDS) {
			await this.ctx.storage.setAlarm(Date.now() + 10 * 1000);
		} else {
			if (this.#browser) {
				await this.#browser.close();
			}
		}
	}
}
