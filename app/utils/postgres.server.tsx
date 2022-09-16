import { Pool } from 'pg';

let db: Pool;

declare global {
  let __db: Pool | undefined;
}

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL,
};

if (process.env.NODE_ENV === 'production') {
  db = new Pool(config);
} else {
  if (!global.__db) {
    global.__db = new Pool(config);
  }

  db = global.__db;
}

export { db };