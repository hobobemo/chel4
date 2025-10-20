<script setup>
const leagueStore = useLeagueStore();

useHead({
  title: leagueStore.getLeagueName + ' - Divisions'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});
</script>

<template>
    <UDashboardPanel>

        <template #header>
            <UDashboardNavbar title="Divisions">
                <template #right>
                    <DashboardDivisionsNew />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UPageGrid>
                <UCard v-for="(a, i) in leagueStore.getDivisions" :key="i">
                    <template #header>
                        {{ a.name }}
                    </template>

                    <template #footer>
                        <div class="flex justify-between">
                            <DashboardDivisionsEdit :item="a" />
                            <DashboardDivisionsDelete :item="a" />
                        </div>
                    </template>
                </UCard>
            </UPageGrid>
        </template>

    </UDashboardPanel>
</template>