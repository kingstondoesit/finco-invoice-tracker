'use server';
 
export async function createInvoice(formData: FormData) {
    const rawFormData = {
        customer_id: formData.get('customerId') as string,
        amount: formData.get('amount') as string,
        status: formData.get('status') as string,
    }

    console.log('rawFormData:', rawFormData);

    return rawFormData;
}
