// Prisma 7+ config. Connection URL lives here (not in schema.prisma).
import path from 'node:path';

import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy example.env to .env and fill it in.');
}

export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma', 'schema.prisma'),
  datasource: { url: databaseUrl },
});
