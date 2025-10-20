<script setup>
    import Stripe from 'stripe';

    const cartStore = useCartStore(); 

    const props = defineProps({
        product: {
            type: String,
            required: true,
        }
    });

    const runtimeConfig = useRuntimeConfig();
    const prices = ref([]);
    const stripe = Stripe(runtimeConfig.public.STRIPE_KEY);

    async function getPrices(){
        const response = await stripe.prices.list({
            product: props.product
        });

        let priceList = response.data;

        for (const price of priceList) {
            var newPrice = price.unit_amount_decimal;
            price.cost = newPrice.substring(0,newPrice.length-2)+"."+newPrice.substring(newPrice.length-2);
            price.features = Object.keys(price.metadata).map((key) => price.metadata[key]);
            prices.value.push(price);
        }

        prices.value.sort((a, b) => a.cost - b.cost);
    }

    async function addToCart(value){
        cartStore.addItemToCart(value);
    }

    onMounted(() => {
        getPrices();
    });

</script>

<template>
    <UPricingGrid>
        <UPricingCard v-for="price in prices" :key="price.id"
            :title="price.nickname"
            :price="'$' + price.cost"
            cycle="/month"
            :highlight="false"
            orientation="vertical"
            align="bottom"
            :features="price.features" 
        >
        
        <template #bottom>
            <UButton
                icon="i-mdi-cart-outline"
                size="lg"
                color="primary"
                variant="solid"
                label="Add to Cart"
                :trailing="false"
                target="_blank"
                @click=addToCart(price)
            />
        </template>

        </UPricingCard>
    </UPricingGrid>
</template>