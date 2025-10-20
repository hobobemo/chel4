<script setup lang="ts">
const userStore = useUserStore()
const consoles = ref([])
const tabs = ref([])
const activeTab = ref(null)
const stats = ref(null)
const loading = ref(false)

async function getStats(system: any) {
  if (!system) return
  loading.value = true
  stats.value = null

  try {
    // Call your backend API
    const response = await $fetch('/api/ea/player', {
      method: 'GET',
      params: {
        name: system.name,
      },
    })

    stats.value = response
  } catch (err) {
    console.error('Error fetching stats:', err)
    stats.value = { error: 'Unable to load player stats.' }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  userStore.getConnections.forEach((system) => {
    if (['xbox', 'playstation', 'psn'].includes(system.type)) {
      consoles.value.push(system)
      tabs.value.push({
        label:
          system.type === 'xbox'
            ? 'Xbox'
            : system.type === 'playstation' || system.type === 'psn'
            ? 'PlayStation'
            : system.type,
        icon:
          system.type === 'xbox'
            ? 'i-lucide-gamepad-2'
            : 'i-lucide-gamepad',
        content: system,
      })
    }
  })

  // Auto-select first console tab (if multiple exist)
  if (tabs.value.length > 0) {
    activeTab.value = tabs.value[0]
    getStats(activeTab.value.content)
  }
})

// Re-fetch stats when active tab changes
watch(activeTab, (newTab) => {
  if (newTab) getStats(newTab.content)
})
</script>

<template>
  <div>
    <UTabs v-if="tabs.length > 0" v-model="activeTab" :items="tabs" class="w-full">
      <template #content="{ item }">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
            <UIcon :name="item.content.type === 'xbox' ? 'i-lucide-gamepad-2' : 'i-lucide-gamepad'" />
            {{ item.label }} ({{ item.content.name }}) - {{ stats[0][0].skplayername }}
          </h3>
{{ stats[0][0] }}
            <ul>
                <li class="flex items-center py-2">
                    <UChip :text="stats[0][0].gamesplayed" size="5xl">
                        <UButton variant="outline" label="Games Played" disabled />
                    </UChip>
                </li>
                <li class="flex items-center py-2">
                    <UChip :text="stats[0][0].skgoals" size="5xl">
                        <UButton variant="outline" label="Goals" disabled />
                    </UChip>
                </li>
            </ul>

        </div>
      </template>
    </UTabs>

    <p v-else class="text-gray-500 text-sm">
      No console connections found.
    </p>
  </div>
</template>
