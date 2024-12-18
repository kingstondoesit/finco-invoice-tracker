import dotenv from 'dotenv';
import { createClient } from '@vercel/postgres';
dotenv.config();

const client = createClient()

async function testConnection() {
  try {
    await client.connect();
    const res = await client.sql`SELECT * FROM invoices`;
    console.log('Connected successfully:', res.rows);
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

testConnection();