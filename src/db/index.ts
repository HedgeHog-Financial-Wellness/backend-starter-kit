import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import env from "@/env.js";
import pg from 'pg'
import { systemLogger } from "@/utils/logger.js";
const versionQuery = sql`SELECT version() as version`;

const errDatabaseNotConnected = new Error('Database not connected. Call connect() first.');
const errDatabaseVersionNotFound = new Error('Database version not found');
const errDBHealthCheckFailed = new Error('Database health check failed');

let pool: pg.Pool | null = null;
export let db: ReturnType<typeof drizzle>;

export const connect = async () => {
    if (pool) return db;

    // WIP: rethink this: how to handle multiple DATABASE_URLs
    pool = new pg.Pool({
        connectionString: env.DATABASE_URL,
    });

    db = drizzle({client: pool});
    await healthCheck();
    systemLogger.info('Database connected');
    return db;
};

export const disconnect = async () => {
    if (pool) {
        await pool.end();
        pool = null;
        systemLogger.info('Database disconnected');
    }
};

export const healthCheck = async () => {
    if (!pool) {
        throw errDatabaseNotConnected;
    }

    try {
        const version = await queryVersion();
        // WIP: add the ability to use common system logger.
        systemLogger.info('Database version:', version);
    } catch (error) {
        systemLogger.error(error);
        // WIP: add the ability to wrap errors in a common error type.
        throw errDBHealthCheckFailed;
    }
};

const queryVersion = async () => {
    if (!db) {
        throw errDatabaseNotConnected;
    }
    const result = await db.execute(versionQuery);
    if (result.rows.length === 0 || !result.rows[0].version) {
        throw errDatabaseVersionNotFound;
    }
    return result.rows[0].version;
};



// Example usage:
// await database.connect();
// const db = database.getInstance();
// const isHealthy = await database.healthCheck();
// await database.disconnect();