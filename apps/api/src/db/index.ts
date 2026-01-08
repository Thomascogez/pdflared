import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import * as schemas from "./schemas";

export const db = drizzle(env.DB, {
	schema: {
		...schemas,
	},
});
