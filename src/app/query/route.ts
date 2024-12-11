import { db } from "@vercel/postgres";

const client = await db.connect();

async function listInvoices() {
	const data = await client.sql`
    SELECT invoices.amount, invoices.status, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
  `;
	return data.rows;
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return Response.json(invoices);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch invoices' }, 
      { status: 500 }
    );
  }
}
