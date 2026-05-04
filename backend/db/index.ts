import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/postgres'
});

export async function query(text:string, params?:any[]) {
  const res = await pool.query(text, params);
  return res.rows;
}
