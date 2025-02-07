import { createApp } from "./app.js";
import { handleSignals } from "./signal.js";
import { connect, disconnect } from "@/db/index.js";
import { configureIdeasEndpoints } from "@/routes/ideas-ts-rest/index.js";
import { systemLogger } from "@/utils/logger.js";
import { configureSwaggerUi } from "./open-api-ts-rest/router.js";
import env from "@/env.js";

export async function main() {
    systemLogger.info("resolving dependencies");
    const db = await connect();
    const app = createApp();

    // configure endpoints
    configureIdeasEndpoints(db, app);

    // configure swagger ui
    configureSwaggerUi(app);

    const server = app.listen(env.PORT, () => {
        systemLogger.info(`Server (DEV) running on port http://localhost:${env.PORT}`);
    });



    // handle signals
    handleSignals(server, disconnect);
}
