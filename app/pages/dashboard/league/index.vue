<script setup>
const userStore = useUserStore();
const leagueStore = useLeagueStore();

useHead({
  title: leagueStore.getLeagueName
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
      
    </template>
  </UDashboardPanel>
</template>