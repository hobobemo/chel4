<script setup>
const leagueStore = useLeagueStore();

useHead({
  title: leagueStore.getLeagueName + ' - Seasons'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});
</script>

<template>
    <UDashboardPanel>

        <template #header>
            <UDashboardNavbar title="Seasons">
                <template #right>
                    <DashboardSeasonsNew />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UPageGrid>
                <UCard v-for="(a, i) in leagueStore.getSeasons" :key="i">
                    <template #header>
                        {{ a.name }}
                    </template>

                    <template #default>
                        <ul>
                            <li class="flex items-center justify-between py-2">
                                <span>Start Date</span>
                                <UBadge variant="outline">
                                    {{ formatDate(Number(a.startDate)) }}
                                </UBadge>
                            </li>
                            <li class="flex items-center justify-between py-2">
                                <span>End Date</span>
                                <UBadge variant="outline">
                                    {{ formatDate(Number(a.endDate)) }}
                                </UBadge>
                            </li>
                            <li class="flex items-center justify-between py-2">
                                <span>Registration Opens</span>
                                <UBadge variant="outline">
                                    {{ formatDate(Number(a.registrationStart)) }}
                                </UBadge>
                            </li>
                            <li class="flex items-center justify-between py-2">
                                <span>Registration Closed</span>
                                <UBadge variant="outline">
                                    {{ formatDate(Number(a.registrationEnd)) }}
                                </UBadge>
                            </li>
                            <li class="flex items-center justify-between py-2">
                                <span>Draft Date</span>
                                <UBadge variant="outline">
                                    {{ formatDate(Number(a.draftDate)) }}
                                </UBadge>
                            </li>
                        </ul>
                    </template>

                    <template #footer>
                        <div class="flex justify-between">
                            <DashboardSeasonsEdit :item="a" />
                            <DashboardSeasonsDelete :item="a" />
                        </div>
                    </template>
                </UCard>
            </UPageGrid>
        </template>

    </UDashboardPanel>
</template>