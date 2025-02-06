import { systemLogger } from "@/utils/logger.js";
import { type Server } from "node:http";

let isShuttingDown = false;

async function onShutdown(server: Server, signal: string, ...cbs: Array<() => Promise<void>>) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    systemLogger.info(`shutting down started: ${signal} received`);
    
    server.close(async () => {
        systemLogger.info("release resources started");
        for (const cb of cbs) {
            await cb();
        }
        systemLogger.info("release resources completed");
        systemLogger.info("application server closed");
        process.exit(0);  // Add explicit exit code 0 for successful shutdown
    });
    setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
    systemLogger.info("shutting down completed");
}

export async function handleSignals(server: Server, ...cbs: Array<() => Promise<void>>) {
    process.on("SIGINT", () => onShutdown(server, "SIGINT", ...cbs));
    process.on("SIGTERM", () => onShutdown(server, "SIGTERM", ...cbs));
}