// /stores/stripeStore.ts
import { defineStore } from 'pinia'

export const useStripeStore = defineStore('stripe', {
  state: () => {
    return {
      products: [],
    }
  },

  getters: {
    getProducts(state) {
      return state.products;
    },
  },

  actions: {
    setProducts(products: any) {
      this.products = products;
    },
    getProduct(productId: string) {
      return this.products.find((product: any) => product.id === productId);
    },
  },
})
