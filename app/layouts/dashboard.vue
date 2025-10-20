<script setup>
  const leagueStore = useLeagueStore();
  const isOpen = ref(false);
</script>

<template>
  <div>
    <LayoutsHeader />

    <!-- Flex container for sidebar + main content -->
    <div class="flex">
      <!-- Sidebar -->
      <UDashboardSidebar id="default" v-model:open="isOpen" collapsible resizable>
        <template #header="{ collapsed }">
          <LayoutsDashboardLeaguesMenu :collapsed="collapsed" />
        </template>

        <template v-if="leagueStore.getLeagueId" #default="{ collapsed }">
          <LayoutsDashboardAdminMenu :collapsed="collapsed" />
        </template>

        <template v-else #default="{ collapsed }">
          <LayoutsDashboardPlayerMenu :collapsed="collapsed" />
        </template>
      </UDashboardSidebar>

      <!-- Main content -->
      <UMain class="flex-1">
        <slot />
      </UMain>
    </div>
  </div>
</template>
