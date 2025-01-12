import {  
  LatestInvoiceRaw, InvoicesTable,  
  Revenue, CustomersTableType, InvoiceForm  
} from './definitions';  
import { formatCurrency } from './utils';  
import dotenv from 'dotenv';  
import { Pool } from 'pg'; // Use Pool instead of Client  

dotenv.config();  

export const pool = new Pool({  
  connectionString: process.env.DATABASE_URL,  
  ssl: {  
    rejectUnauthorized: false,  
  },  
});  

// Function to fetch revenue data  
export async function fetchRevenue() { 
  const client = await pool.connect(); 
  try {  
    const data = await client.query<Revenue>('SELECT * FROM revenue');  
    return data.rows;  
  } catch (error) {  
    console.error('Database Error:', error);  
    throw new Error('Failed to fetch revenue data 🔴');  
  } finally {  
    client.release(); 
  }  
}  

// Function to fetch latest invoices  
export async function fetchLatestInvoices() { 
  const client = await pool.connect(); 
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
  } finally {  
    client.release(); 
  }  
}  

// Function to fetch card data  
export async function fetchCardData() { 
  const client = await pool.connect(); 
  try {  
    const invoiceCountPromise = client.query(`SELECT COUNT(*) FROM invoices`);  
    const customerCountPromise = client.query(`SELECT COUNT(*) FROM customers`);  
    const invoiceStatusPromise = client.query(`SELECT  
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,  
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending  
      FROM invoices;`);  

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
  } finally {  
    client.release(); // Release the client back to the pool  
  }  
}  

const ITEMS_PER_PAGE = 10;  

export async function fetchFilteredInvoices(  
  query: string | undefined,  
  currentPage: number,  
) {  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;  
  const queryString = query ?? '';  
  console.log('QueryString:', queryString);  
  const client = await pool.connect();
  try {  
    const client = await pool.connect(); // Acquire a client from the pool  
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
    `, [`%${queryString}%`, ITEMS_PER_PAGE, offset]);  

    console.log('Filtered Invoices fetched successfully 🟢');  
    return invoices.rows;  
  } catch (error) {  
    console.error('Database Error:', error);  
    throw new Error('Failed to fetch filtered invoices 🔴');  
  } finally {  
    client.release(); 
  }  
}  

export async function fetchInvoicesPages(query: string) { 
  const client = await pool.connect(); 
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
    `, [`%${query}%`]);  

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE); // Calculate total pages  
    return totalPages;  
  } catch (error) {  
    console.error('Database Error:', error);  
    throw new Error('Failed to fetch total number of invoices.');  
  } finally {  
    client.release(); // Release the client back to the pool  
  }  
}  

export async function fetchInvoiceById(id: string) {
  const client = await pool.connect();  
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
  } finally {  
    client.release();  
  }  
}  

export async function fetchCustomers() { 
  const client = await pool.connect(); 
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
  } finally {  
    client.release(); 
  }  
}  