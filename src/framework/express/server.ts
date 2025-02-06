import { createApp } from "./app.js";
import { handleSignals } from "./signal.js";
import { connect, disconnect } from "@/db/index.js";
import { systemLogger } from "@/utils/logger.js";

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

