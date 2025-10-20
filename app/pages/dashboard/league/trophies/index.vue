<script setup>
const leagueStore = useLeagueStore();

useHead({
  title: leagueStore.getLeagueName + ' - Trophies'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Trophies">
          <template #right>
              <DashboardTrophiesNew />
          </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageGrid>
          <UCard v-for="(a, i) in leagueStore.getTrophies" :key="i">
              <template #header>
                  {{ a.name }}
              </template>

              {{ a.desc }}

              <template #footer>
                  <div class="flex justify-between">
                      <DashboardTrophiesEdit :item="a" />
                      <DashboardTrophiesDelete :item="a" />
                  </div>
              </template>
          </UCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>