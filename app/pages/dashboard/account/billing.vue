<script setup>
useHead({
  title: "Billing"
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});

const stripeStore = useStripeStore();
const userStore = useUserStore();
const subscriptions = ref(null);

onMounted(async () => {
    const response = await $fetch('/api/stripe/subscriptions', {
        params: {
            customerId: userStore.getCustomerId
        }
    });
    subscriptions.value = response;
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Billing" />
    </template>

    <template #body>
      <div class="flex flex-col h-[calc(100vh-100px)]">
        <div class="flex-1 overflow-y-auto px-4 py-1">
          <UPageGrid>
            <DashboardAccountBillingSubscriptions v-if="subscriptions" v-for="(a, i) in subscriptions?.data" :key="i" :item="a" />
          </UPageGrid>
        </div>
        <DashboardAccountBillingTable />
      </div>
    </template>
  </UDashboardPanel>
</template>
