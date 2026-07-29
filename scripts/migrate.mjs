import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
import { loadLocalEnv } from "./env.mjs";

loadLocalEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Add it to .env.local or export it before running migrations.");
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });
const schema = readFileSync(resolve(process.cwd(), "db/schema.sql"), "utf8");

await sql.unsafe(schema);
await sql.end();

console.log("Database migration completed.");
