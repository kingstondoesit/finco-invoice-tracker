'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { pool } from './data';

const FormSchema = z.object({
  id: z.string(),
  customer_Id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const client = await pool.connect();
  try {
    const { customer_Id, amount, status } = CreateInvoice.parse({
      customer_Id: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await client.query(
      `INSERT INTO invoices (customer_id, amount, status, date)
     VALUES ($1, $2, $3, $4)`,
      [customer_Id, amountInCents, status, date]
    );

    console.log('Invoice created successfully 🟢');

    await updateRevenue();

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

  } catch (error) {
    console.error('Error creating invoice:', error);

  } finally {
    client.release();
  }
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const client = await pool.connect();
  try {
    const { customer_Id, amount, status } = UpdateInvoice.parse({
      customer_Id: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    const amountInCents = amount * 100;

    await client.query(
      `UPDATE invoices
       SET customer_id = $1, amount = $2, status = $3
       WHERE id = $4`,
      [customer_Id, amountInCents, status, id]
    );

    console.log('Invoice updated successfully 🟢');

    await updateRevenue();

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  } catch (error) {
    console.error('Error updating invoice:', error);

  } finally {
    client.release();
  }
}

export async function deleteInvoice(id: string) {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM invoices
       WHERE id = $1`,
      [id]
    );

    console.log('Invoice deleted successfully 🟢');

    await updateRevenue();

    revalidatePath('/dashboard/invoices');

  } catch (error) {
    console.error('Error deleting invoice:', error);
  } finally {
    client.release();
  }
}

export async function updateRevenue() {
  const client = await pool.connect();
  try {
    // Delete the existing revenue data
    await client.query(`DELETE FROM revenue`);

    // Insert new revenue data
    await client.query(`  
      INSERT INTO revenue (month, revenue)  
    SELECT   
      TO_CHAR(date::DATE, 'Mon') AS month,  
      SUM(amount) AS revenue  
    FROM   
      invoices  
    WHERE   
      status = 'paid'  
    GROUP BY   
      TO_CHAR(date::DATE, 'Mon')  
    ORDER BY   
      MIN(date::DATE);  
  `);

    console.log("Revenue updated 🟢");
  } catch (error) {
    console.error('Error updating revenue:', error);
  } finally {
    client.release();
  }
}