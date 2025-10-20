<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const leagueStore = useLeagueStore();

const props = defineProps({
  collapsed: {
    type: Boolean
  }
});

let response = ref(null);
let teams = ref([
  { label: 'My Home', id: 'home' }
]);

const selectedTeam = ref(teams.value[0]);

async function getLeagues(value) {
  value.forEach(item => {
    const set = {
      label: item.name,
      id: item.id  // assuming each league has a unique ID
    };
    teams.value.push(set);
  });
}

const items = computed(() => {
  const teamItems = teams.value.map(team => ({
    ...team,
    onSelect() {
      selectedTeam.value = team;
      if (team.id === 'home') {
        leagueStore.unSetLeague();
        router.push('/dashboard');
      } else {
        leagueStore.setLeague(team);
        router.push('/dashboard/league');
      }
    }
  }));

  const menuItems = [teamItems];

  if (userStore.level === 1) {
    menuItems.push([
      {
        label: 'Create League',
        icon: 'i-lucide-circle-plus',
        onSelect() {
          router.push('/dashboard/league/new');
        }
      }
    ]);
  }

  return menuItems;
});

onMounted(async () => {
  await getLeagues(userStore.getLeagues);
});
</script>


<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>