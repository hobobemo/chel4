import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cart: [],
      cartId: null,
      cartUrl: null,
    }
  },
  getters: {
    getCart(state) {
      return state.cart
    },
    getCartQuantity(state) {
      return state.cart.reduce((sum, item) => sum + item.quantity, 0)
    },
    getCartTotalAmount(state) {
      return state.cart.reduce((sum, item) => sum + (item.amount * item.quantity), 0)
    },
    getCartId(state){
      return state.cartId;
    },
    getCartUrl(state){
      return state.cartUrl;
    },
    getStripeCart(state) {
      const items = state.cart.map(item => ({
        price: item.priceId,
        quantity: item.quantity,
      }));
      
      return items;
    },
  },
  actions: {
    addToCart(name: string, priceId: string, amount: number, quantity: number = 1) {
      const existingItem = this.cart.find(item => item.priceId === priceId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.cart.push({ name, priceId, amount, quantity })
      }
    },
    emptyCart() {
      this.cart = []
    },
    clearCheckout(){
      this.cart = [];
      this.cartUrl = null;
    },
    increaseQuantity(priceId: string) {
      const item = this.cart.find(item => item.priceId === priceId)
      if (item) {
        item.quantity += 1
      }
    },
    decreaseQuantity(priceId: string) {
      const item = this.cart.find(item => item.priceId === priceId)
      if (item) {
        item.quantity -= 1
        if (item.quantity <= 0) {
          this.removeItem(priceId)
        }
      }
    },
    removeItem(priceId: string) {
      this.cart = this.cart.filter(item => item.priceId !== priceId)
    },
    addStripeCheckout(item: object){
      this.cartId = item.id;
      this.cartUrl = item.url;
    },
  },
})
