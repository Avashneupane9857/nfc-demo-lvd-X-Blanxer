import postgres from "postgres";

declare global {
  var lvdSql: postgres.Sql | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Add your Neon PostgreSQL connection string to .env.local and Vercel.",
    );
  }

  return databaseUrl;
}

export function db() {
  if (!globalThis.lvdSql) {
    globalThis.lvdSql = postgres(getDatabaseUrl(), {
      ssl: "require",
      max: 5,
    });
  }

  return globalThis.lvdSql;
}
