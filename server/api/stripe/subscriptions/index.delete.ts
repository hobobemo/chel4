import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2023-08-16'
});

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = query.subscriptionId as string;

    if (!id) {
        throw createError({ statusCode: 400, message: 'Missing customerId' });
    }

    try {
        const items = await stripe.subscriptions.cancel(id);

        return items;
    } catch (error: any) {
        console.error('[Stripe Error]', error.message);
        return {
            success: false,
            message: error.message
        };
    }
});