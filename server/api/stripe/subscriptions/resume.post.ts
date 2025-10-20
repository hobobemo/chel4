import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2023-08-16'
});

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const subscriptionId = query.subscriptionId as string;

    if (!subscriptionId) {
        throw createError({ statusCode: 400, message: 'Missing subscriptionId' });
    }

    try {
        const items = await stripe.subscriptions.resume(
            subscriptionId,
            {
                billing_cycle_anchor: 'now',
            }
        );

        return items;
    } catch (error: any) {
        console.error('[Stripe Error]', error.message);
        return {
            success: false,
            message: error.message
        };
    }
});