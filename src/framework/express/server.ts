import { createApp } from "./app.js";
import { handleSignals } from "./signal.js";
import { connect, disconnect } from "@/db/index.js";
import { configureIdeasEndpoints } from "@/routes/ideas-ts-rest/index.js";
import { systemLogger } from "@/utils/logger.js";
import { configureOpenApi } from "./open-api-ts-rest/generator.js";
import { configureSwaggerUi } from "./open-api-ts-rest/router.js";


export async function main() {

    // connect to db
    systemLogger.info("Connecting to db");
    await connect();


    const app = createApp();

    const server = app.listen(4000, () => {
        systemLogger.info(`Server (DEV) running on port http://localhost:4000`);
    });

    // handle signals
    handleSignals(server, disconnect);
}

export async function startServer() {
    // main.ts
    systemLogger.info("Connecting to db");

    const db = await connect();
    const app = createApp();

    // configure endpoints
    configureIdeasEndpoints(db, app);

    // configure swagger ui
    configureSwaggerUi(app);

    const server = app.listen(4000, () => {
        systemLogger.info(`Server (DEV) running on port http://localhost:4000`);
    });



    // handle signals
    handleSignals(server, disconnect);
}
