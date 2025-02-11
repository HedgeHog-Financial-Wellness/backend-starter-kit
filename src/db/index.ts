import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const versionQuery = sql`SELECT version() as version`;

const errDatabaseVersionNotFound = new Error("Database version not found");

async function queryVersion(db: ReturnType<typeof drizzle>): Promise<string> {
  const result = await db.execute(versionQuery);
  const version = result.rows[0]?.version;
  if (typeof version !== "string")
    throw errDatabaseVersionNotFound;
  return version;
}

function dbInstance(url: string) {
  let pool: pg.Pool | null = null;
  let db: ReturnType<typeof drizzle> | null = null;
  let connecting: Promise<ReturnType<typeof drizzle>> | null = null;

  const connect = async () => {
    if (db)
      return db;
    if (connecting)
      return connecting;

    connecting = (async () => {
      pool = new pg.Pool({ connectionString: url });
      db = drizzle({ client: pool });

      try {
        const version = await queryVersion(db);
        // eslint-disable-next-line no-console
        console.log(`database connected, version: ${version}`);
        return db;
      }
      catch (error) {
        await pool.end();
        throw error;
      }
    })();

    return connecting.finally(() => (connecting = null));
  };

  const disconnect = async () => {
    if (pool) {
      await pool.end();
      pool = null;
      db = null;

      // eslint-disable-next-line no-console
      console.log("database disconnected");
    }
  };

  return { connect, disconnect };
}

// eslint-disable-next-line node/no-process-env
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl)
  throw new Error("DATABASE_URL environment variable is not set");

const dbInst = dbInstance(databaseUrl);
const db = await dbInst.connect();

export default Object.freeze({ db, disconnect: dbInst.disconnect });
