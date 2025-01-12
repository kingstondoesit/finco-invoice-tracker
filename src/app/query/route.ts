import { db, VercelPoolClient } from "@vercel/postgres";

async function listInvoices(client: VercelPoolClient) {  
    const data = await client.query(`  
        SELECT invoices.amount, invoices.status, customers.name, invoices.amount, customers.email, invoices.id, invoices.date  
        FROM invoices  
        JOIN customers ON invoices.customer_id = customers.id  
    `);  
    return data.rows;  
}  

export async function fetchInvoicesPages(client: VercelPoolClient, query: string) {
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

    console.log('results count:', count.rows[0]); 
    return count.rows[0].count;
    }

export async function GET() {  
    const client = await db.connect();  
    const testQuery = 'delba';  

    try {  
        const invoices = await listInvoices(client);  
        const count = await fetchInvoicesPages(client, testQuery); // Use the hardcoded query  

        return Response.json({  
            invoices,  
            "query result": count // Return both invoices and query count 
        });  
    } catch (error) {  
        console.error(error); // Log the error for further inspection  
        return Response.json(  
            { error: 'Failed to fetch invoices' },  
            { status: 500 }  
        );  
    } finally {  
        client.release();  
    }  
}  