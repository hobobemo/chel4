import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2023-08-16'
})

export default defineEventHandler(async (event) => {
  // Read from request body, not query
  const body = await readBody(event)
  const subscriptionId = body.subscriptionId as string

  console.log('Canceling subscription:', subscriptionId)

  if (!subscriptionId) {
    throw createError({ statusCode: 400, message: 'Missing subscriptionId' })
  }

  try {
    const cancelled = await stripe.subscriptions.cancel(subscriptionId)
    return { success: true, cancelled }
  } catch (error: any) {
    console.error('[Stripe Error]', error.message)
    return { success: false, message: error.message }
  }
})
