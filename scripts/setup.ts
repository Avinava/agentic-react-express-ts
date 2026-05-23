/**
 * Interactive setup helper.
 * Ensures .env exists, then prints next steps.
 */
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const ENV = resolve(ROOT, '.env');
const EXAMPLE = resolve(ROOT, 'example.env');

function step(label: string): void {
  console.log(`\n▸ ${label}`);
}

step('Checking .env');
if (!existsSync(ENV)) {
  copyFileSync(EXAMPLE, ENV);
  console.log('  Created .env from example.env — review DATABASE_URL before continuing.');
} else {
  console.log('  .env already exists — skipping.');
}

step('Generating Prisma client');
try {
  execSync('npx prisma generate', { cwd: ROOT, stdio: 'inherit' });
} catch {
  console.error('  prisma generate failed. Check DATABASE_URL and try `npm run db:setup`.');
  process.exit(1);
}

console.log(`
Setup complete. Next steps:
  1. Confirm DATABASE_URL in .env
  2. npm run db:setup          # create tables
  3. npm run db:seed           # load sample CRM data
  4. npm run dev               # start client (:3000) + server (:3001)

For agents:
  - Read AGENTS.md first.
  - Available skills are in ./skills/
`);
