<script setup>
const leagueStore = useLeagueStore();

useHead({
  title: leagueStore.getLeagueName + ' - Teams'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});
</script>

<template>
    <UDashboardPanel>

        <template #header>
            <UDashboardNavbar title="Teams">
                <template #right>
                    <DashboardTeamsNew />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UPageGrid>
                <UCard v-for="(a, i) in leagueStore.getTeams" :key="i">
                    <template #header>
                        <div class="flex items-center gap-3">
                            <NuxtImg width="32" height="32" class="rounded" :src="getTeamLogo({ crestAssetId: a.crestAssetId, useBaseAsset: a.useBaseAsset, isCustomTeam: a.isCustomTeam })" />
                            <span class="font-medium text-lg">{{ a.name }}</span>
                        </div>
                    </template>

                    <template #footer>
                        <div class="flex justify-between">
                            <DashboardTeamsEdit :item="a" />
                            <DashboardTeamsDelete :item="a" />
                        </div>
                    </template>
                </UCard>
            </UPageGrid>
        </template>

    </UDashboardPanel>
</template>