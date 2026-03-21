// ============================================================
// src/lib/db.ts
//
// Prisma client singleton for Supabase PostgreSQL.
//
// Vercel's serverless environment creates new function instances
// on every invocation. Without this singleton pattern, each
// cold start would open a NEW database connection, rapidly
// exhausting the PostgreSQL connection limit.
//
// This pattern:
//  1. Reuses the same PrismaClient across hot function reloads in dev
//  2. Uses Supabase Postgres pooled URL (POSTGRES_PRISMA_URL) for
//     all runtime queries — this goes through PgBouncer
//  3. Migrations use POSTGRES_URL_NON_POOLING to avoid pgBouncer
//     issues with DDL statements
// ============================================================

import { PrismaClient } from '@prisma/client';

// Extend the global namespace to hold the cached instance
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],

    // datasourceUrl is picked from DATABASE_URL env var automatically
    // DATABASE_URL should be set to POSTGRES_PRISMA_URL (pooled)
  });
}

// In development, reuse the global to survive HMR (hot module replacement)
// In production, always create a fresh instance (serverless functions are isolated)
const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
export { prisma };
