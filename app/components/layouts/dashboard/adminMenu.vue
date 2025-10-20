<script setup>
const leagueStore = useLeagueStore();

const props = defineProps({
  collapsed: {
    type: Boolean,
  }
});

const links = computed(() => [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/dashboard/league',
      onSelect: () => (open.value = false)
    },
    {
      label: 'Divisions',
      icon: 'i-lucide-circle-slash-2',
      to: '/dashboard/league/divisions',
      badge: leagueStore.getDivisionCount,
      onSelect: () => (open.value = false)
    },
    {
      label: 'Seasons',
      icon: 'i-lucide-snowflake',
      to: '/dashboard/league/seasons',
      badge: leagueStore.getSeasonCount,
      onSelect: () => (open.value = false)
    },
    {
      label: 'Teams',
      icon: 'i-lucide-users',
      to: '/dashboard/league/teams',
      badge: leagueStore.getTeamCount,
      onSelect: () => (open.value = false)
    },
    {
      label: 'Schedule',
      to: '#',
      icon: 'i-lucide-calendar',
      defaultOpen: true,
      type: 'trigger',
      children: [
        {
          label: 'Match Management',
          to: '/dashboard/league/schedule',
          exact: true,
          onSelect: () => (open.value = false)
        },
        {
          label: 'Schedule Generator',
          to: '/dashboard/league/schedule/generator',
          onSelect: () => (open.value = false)
        }
      ]
    }, {
      label: 'Trophies',
      icon: 'i-lucide-trophy',
      to: '/dashboard/league/trophies',
      badge: leagueStore.getTrophyCount,
      onSelect: () => (open.value = false)
    }
  ]
])

</script>

<template>
    <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
</template>