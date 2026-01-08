import { templateController } from "#controllers/template.controller";
import { templateVersionController } from "#controllers/template-version.controller";
import { $ } from "#utils/factory";
import { checkApiKeyMiddleware } from "./middlewares/check-api-key-middleware";

const app = $.createApp();

app.use("*", checkApiKeyMiddleware);

const router = app
	.route("/templates", templateController)
	.route("/templates", templateVersionController);

export type Router = typeof router;

export default app;
export * from "#do/browser-rendering-do";
