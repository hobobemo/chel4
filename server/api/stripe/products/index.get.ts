import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2023-08-16'
})

export default defineEventHandler(async () => {
  try {
    // Get all active products and their active prices
    const products = await stripe.products.list({ active: true })
    const prices = await stripe.prices.list({ active: true })

    // Combine prices with their corresponding products
    const items = products.data.map((product) => {
      const productPrices = prices.data.filter(
        (price) => price.product === product.id
      )
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata,
        prices: productPrices.map((price) => ({
          id: price.id,
          currency: price.currency,
          unit_amount: price.unit_amount,
          recurring: price.recurring,
          type: price.type,
          nickname: price.nickname,
        })),
      }
    })

    return {
      success: true,
      count: items.length,
      products: items,
    }
  } catch (error: any) {
    console.error('[Stripe Error]', error.message)
    return {
      success: false,
      message: error.message,
    }
  }
})
