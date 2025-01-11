import {
  LatestInvoiceRaw, InvoicesTable,
  Revenue, CustomersTableType, InvoiceForm
} from './definitions';
import { formatCurrency } from './utils';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

export const client = new Client({
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
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    // const waitTime: number = 3000;
    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Fetch data from the revenue table  
    const data = await client.query<Revenue>('SELECT * FROM revenue');
    // console.log(`Revenue Data fetched successfully after ${waitTime/1000} seconds 🟢`);
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

export async function fetchCardData() {
  try {
    // You can query your database to fetch the number of invoices and total revenue   
    const invoiceCountPromise = await client.query(`SELECT COUNT(*) FROM invoices`)
    const customerCountPromise = await client.query(`SELECT COUNT(*) FROM customers`)
    const invoiceStatusPromise = await client.query(`SELECT
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
      FROM invoices;`)

    // fetch data in parallel instead of waterfall where one fetch process is dependent on the previous one to finish
    const data = await Promise.all([invoiceCountPromise, customerCountPromise, invoiceStatusPromise]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    console.log('Card Data fetched successfully 🟢');
    return {
      numberOfInvoices,
      numberOfCustomers,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data 🔴');
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredInvoices(
  query: string | undefined,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const queryString = query ?? '';
  console.log('queryString', queryString);
  console.log('offset', offset);
  try {
    const invoices = await client.query<InvoicesTable>(`  
      SELECT  
        invoices.id,  
        invoices.amount,  
        invoices.date,  
        invoices.status,  
        customers.name,  
        customers.email,  
        customers.image_url  
      FROM invoices  
      JOIN customers ON invoices.customer_id = customers.id  
      WHERE  
        customers.name ILIKE $1 OR  
        customers.email ILIKE $1 OR  
        invoices.amount::text ILIKE $1 OR  
        invoices.date::text ILIKE $1 OR  
        invoices.status ILIKE $1  
      ORDER BY invoices.date DESC  
      LIMIT $2 OFFSET $3  
    `, [`%${query}%`, ITEMS_PER_PAGE, offset]);

    console.log('Filtered Invoices fetched successfully 🟢');
    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered invoices 🔴');
  }
}

export async function fetchInvoicesPages(query: string) {  
  try {  
    const count = await client.query(`  
      SELECT COUNT(*)  
      FROM invoices  
      JOIN customers ON invoices.customer_id = customers.id  
      WHERE customers.name ILIKE $1  
      OR customers.email ILIKE $1  
      OR invoices.amount::text ILIKE $1  
      OR invoices.date::text ILIKE $1  
      OR invoices.status ILIKE $1  
    `, [`%${query}%`]);  // Use an array to safely pass the parameter  

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE); // divide count by items per page to get the total number of pages. use Math.ceil to round up to the nearest integer.
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await client.query<InvoiceForm>(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = $1;
    `, [id]);

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await client.query<CustomersTableType>(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}