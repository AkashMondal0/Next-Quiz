import "dotenv/config";
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/lib/db/drizzle/drizzle.schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.PG_URL ?? "postgresql://postgres:password@localhost:5432/postgres",
    ssl: {
      rejectUnauthorized: false,
    },
    database: "multiplayer",
  },
  verbose: true,
  strict: true,
})