<script setup>
const stripeStore = useStripeStore();
const userStore = useUserStore();

const invoices = ref([]);

onMounted(async () => {
    const response = await $fetch('/api/stripe/billing/invoices', {
        params: {
            customerId: userStore.getCustomerId
        }
    })

    response.data.forEach(invoice => {
        const item = {
            id: invoice.id,
            amount: invoice.amount_due,
            date: invoice.due_date,
            status: invoice.status,
        }
        invoices.value.push(item);
    });
})
</script>

<template>
    <div class="sticky bottom-0 w-full">
        <div class="overflow-x-auto">
            {{ invoices }}
            <UTable :data="invoices" class="w-full table-auto border-collapse text-sm" />
        </div>
    </div>
</template>