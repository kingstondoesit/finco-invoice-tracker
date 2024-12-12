import {
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
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

// Connect to the database outside of the functions  
(async () => {
  await client.connect();
})().catch(error => console.error('Connection Error:', error));

export async function fetchRevenue() {
  try {
    // Fetch data from the revenue table  
    const data = await client.query<Revenue>('SELECT * FROM revenue');
    console.log('Revenue Data fetched successfully 🟢');
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data 🔴');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await client.query<LatestInvoiceRaw>(
      `SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id   
       FROM invoices   
       JOIN customers ON invoices.customer_id = customers.id   
       ORDER BY invoices.date DESC LIMIT 5;`
    );

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    console.log('Latest Invoices fetched successfully 🟢');
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices 🔴');
  }
}  