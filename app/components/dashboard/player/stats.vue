<script setup lang="ts">
const userStore = useUserStore()
const consoles = ref([])
const tabs = ref([])
const activeTab = ref(null)
const stats = ref([])
const loading = ref(false)

async function getStats(system: any) {
  if (!system) return
  loading.value = true
  stats.value = []

  try {
    const response = await $fetch('/api/ea/player', {
      params: { name: system.name }
    })

    // always return an array
    stats.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching stats:', err)
    stats.value = []
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
        content: system
      })
    }
  })

  if (tabs.value.length > 0) {
    activeTab.value = tabs.value[0]
    getStats(activeTab.value.content)
  }
})

watch(activeTab, (newTab) => {
  if (newTab) getStats(newTab.content)
})
</script>
