<script setup>
const leagueStore = useLeagueStore();

let items = ref(null);

async function getItems(){
  items.value = await $fetch(`/api/league/schedules?leagueId=${leagueStore.getLeagueId}`)
}

onMounted(() => {
  getItems();
})

useHead({
  title: leagueStore.getLeagueName + ' - Match Management'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Match Management">
          <template #right>
              <DashboardScheduleNew @action="getItems()"/>
          </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageGrid>
          <UCard v-for="(a, i) in items" :key="i">
              <template #header>
                  {{ formatDate(Number(a.schedule.gameTime)) }}
              </template>

              <div class="flex items-center justify-center gap-2">
                <NuxtImg height="16" width="16" :src="getTeamLogo(leagueStore.getTeamByClubId(a?.schedule?.awayId))" />
                {{ leagueStore.getTeamByClubId(a?.schedule?.awayId).abbr }}
                <span v-if="a.matchResult">{{ a?.matchResult?.garaw }}</span>

                <USeparator icon="i-lucide-at-sign" />

                <span v-if="a.matchResult">{{ a?.matchResult?.gfraw }}</span>
                {{ leagueStore.getTeamByClubId(a?.schedule?.homeId).abbr }}
                <NuxtImg height="16" width="16" :src="getTeamLogo(leagueStore.getTeamByClubId(a?.schedule?.homeId))" />
              </div>

              <template #footer>
                <div class="flex gap-4" v-if="!a.matchResult">
                  <DashboardScheduleEditMatch :item="a" @action="getItems()" />
                  <DashboardScheduleManual :item="a" @action="getItems()" />
                  <DashboardScheduleSelect :item="a" @action="getItems()" />
                  <DashboardScheduleDelete :item="a" @action="getItems()" />
                </div>
                <div class="flex gap-4" v-else>
                  <DashboardScheduleEditResults :item="a" @action="getItems()" />
                  <DashboardScheduleLagout :item="a" @action="getItems()" />
                  <DashboardScheduleCustomTeam :item="a" @action="getItems()" />
                  <DashboardScheduleDelete :item="a" @action="getItems()"/>
                </div>
              </template>
          </UCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>