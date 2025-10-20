<script setup>
const userStore = useUserStore();

useHead({
  title: "My Account"
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

</script>

<template>
  <UDashboardPanel>
    <template #header>
        <UDashboardNavbar title="Account"/>
    </template>

    <template #body>

    </template>
  </UDashboardPanel>
</template>