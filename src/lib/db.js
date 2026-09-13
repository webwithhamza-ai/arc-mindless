import "server-only";
import { neon } from "@neondatabase/serverless";

// Lazy + guarded: constructing neon() with no connection string throws
// immediately. Defer that to first actual use so a missing DATABASE_URL turns
// into a normal per-request error (caught by each route handler) instead of
// crashing the server.
let realSql = null;

function getSql() {
  if (!realSql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Database not configured yet (set DATABASE_URL in .env.local)");
    }
    realSql = neon(process.env.DATABASE_URL);
  }
  return realSql;
}

export function sql(strings, ...values) {
  return getSql()(strings, ...values);
}

let schemaReady = null;

// Called (and memoized) on first request that touches the DB. Safe to run
// repeatedly (IF NOT EXISTS) — cheap no-op after the first call per process.
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS whitelist_entries (
          id SERIAL PRIMARY KEY,
          twitter_username TEXT NOT NULL,
          evm_address TEXT NOT NULL UNIQUE,
          followed BOOLEAN NOT NULL DEFAULT FALSE,
          reposted BOOLEAN NOT NULL DEFAULT FALSE,
          liked BOOLEAN NOT NULL DEFAULT FALSE,
          spot_number INTEGER,
          quote_link TEXT,
          submitted_at TIMESTAMPTZ,
          confirmed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS whitelist_entries_twitter_idx
          ON whitelist_entries (lower(twitter_username))
      `;
    })();
  }
  return schemaReady;
}
