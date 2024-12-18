// db vercel test with dotenv

import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

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