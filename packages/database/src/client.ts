import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://byteagrox_user:byteagrox_password@localhost:5432/byteagrox_db';

// Disable prefetch for serverless/local postgres compatibility
export const queryClient = postgres(connectionString, { prepare: false });
export const db = drizzle(queryClient, { schema });
