import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2023-08-16'
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const items = await stripe.customers.create({
    email: body.email,
    name: body.name,
  });
  return items;
});