import 'dotenv/config';

import { createServer } from 'node:http';
import path from 'node:path';

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { createContext } from './context.js';
import { prisma } from './prisma.js';
import { appRouter } from './routers/index.js';

const PORT = Number(process.env.PORT ?? 3001);
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isDev = NODE_ENV === 'development';

const app = express();

app.use(helmet({ contentSecurityPolicy: isDev ? false : undefined }));
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: NODE_ENV });
});

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, path: trpcPath }) {
      console.error(`tRPC error on ${trpcPath ?? '<no-path>'}:`, error);
    },
  }),
);

if (!isDev) {
  const clientDir = path.resolve('dist/client');
  app.use(express.static(clientDir));
  app.get('/*splat', (_req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'));
  });
}

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${String(PORT)} (${NODE_ENV})`);
});

const shutdown = (signal: string): void => {
  console.log(`\n${signal} received. Shutting down...`);
  server.close(() => {
    void prisma.$disconnect().then(() => {
      process.exit(0);
    });
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
