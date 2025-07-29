import "dotenv/config";
import { Injectable } from '@nestjs/common';
import * as postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './drizzle.schema';
import configuration from "src/lib/configs/configuration";
const url = configuration().PG_URL;
if (!url) throw new Error("PG_URL is not defined in .env file");
const sql = postgres(url, {
    ssl: {
        rejectUnauthorized: false,
    },
});

@Injectable()
export class DrizzleProvider {
    db: PostgresJsDatabase<typeof schema> = drizzle(sql, {
        schema: schema
    });
}