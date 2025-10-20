<script setup>
const userStore = useUserStore();

useHead({
  title: 'My Player'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

</script>

<template>
  <UDashboardPanel>
    <template #header>
        <UDashboardNavbar title="My Player"/>
    </template>

    <template #body>
      
    </template>
  </UDashboardPanel>
</template>