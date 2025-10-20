<script setup>
const userStore = useUserStore();

useHead({
  title: 'Dashboard'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

</script>

<template>
  <UDashboardPanel>
    <template #header>
        <UDashboardNavbar title="Dashboard"/>
    </template>

    <template #body>
      <UPageGrid>
        <UCard v-for="(a, i) in userStore.getGuilds" :key="i">
          <template #header>
            {{ a.name }}
          </template>

          <template #footer>

          </template>
        </UCard>

      </UPageGrid>

    </template>
  </UDashboardPanel>
</template>