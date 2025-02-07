import { createApp } from "./app.js";
import { handleSignals } from "./signal.js";
import { connect, disconnect } from "@/db/index.js";
import { configureIdeasEndpoints } from "@/routes/ideas-ts-rest/index.js";
import { systemLogger } from "@/utils/logger.js";
import configureOpenAPI from "./open-api/configure.js";
import env from "@/env.js";

export async function main() {
    systemLogger.info("resolving dependencies");
    const db = await connect();
    const app = createApp();

    // configure swagger ui
    configureOpenAPI(app);

    // configure endpoints
    configureIdeasEndpoints(db, app);

    

    const server = app.listen(env.PORT, () => {
        systemLogger.info(`Server (DEV) running on port http://localhost:${env.PORT}`);
    });



    // handle signals
    handleSignals(server, disconnect);
}
