// next/env db driver test

import { db } from '@vercel/postgres';
import pkg from '@next/env';

const { loadEnvConfig } = pkg;

const projectDir = process.cwd();
loadEnvConfig(projectDir)

const client = await db.connect();

async function testConnection() {
  try {
    const res = await client.sql`SELECT * FROM invoices`;
    console.log('Connected successfully:', res.rows);
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();