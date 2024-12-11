import {
  Revenue,
} from './definitions';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function fetchRevenue() {
  try {
    // Connect to the database
    await client.connect();

    // Fetch data from the revenue table
    const data = await client.query<Revenue>('SELECT * FROM revenue');

    console.log('Data fetched successfully 🟢');

    // Return the rows
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data. 🔴');
  } finally {
    // Ensure the database connection is closed
    await client.end();
  }
}