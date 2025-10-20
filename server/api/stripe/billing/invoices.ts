import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2023-08-16'
});

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const customerId = query.customerId as string;

  if (!customerId) {
    throw createError({ statusCode: 400, message: 'Missing customerId' });
  }

  try {
    const items = await stripe.invoices.list({
        customer: customerId,
    });

    return items;
  } catch (err: any) {
    console.error('Stripe error:', err.message);
    throw createError({ statusCode: 500, message: 'Failed to retrieve customer' });
  }
});
