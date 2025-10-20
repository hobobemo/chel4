<script setup lang="ts">
const emit = defineEmits(['item'])
const isLoading = ref(false)

const props = defineProps({
  item: {
    type: Object,
    required: false
  }
})

const items = ref<any[]>([])
const formData = ref({ name: '' })
const team = ref<any>(null)

async function getItems(value: string) {
  if (!value) {
    items.value = []
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch(`/api/ea/team`, {
      params: { name: value }
    })

    // Ensure response is an array
    if (!Array.isArray(response) || !response.length) {
      items.value = []
      return
    }

    items.value = response
      .filter((item: any) => item?.clubInfo)
      .map((item: any) => ({
        eaName: item.clubInfo.name,
        clubId: item.clubInfo.clubId,
        crestAssetId: item.clubInfo.customKit?.crestAssetId,
        useBaseAsset: item.clubInfo.customKit?.useBaseAsset,
        isCustomTeam: item.clubInfo.customKit?.isCustomTeam
      }))
  } catch (err) {
    console.error('[EA TEAM] Fetch failed:', err)
    items.value = []
  } finally {
    isLoading.value = false
  }
}

watch(
  () => formData.value.name,
  (newVal) => {
    if (newVal && newVal.length >= 2) {
      // Don’t spam API for every keystroke
      getItems(newVal)
    } else {
      items.value = []
    }
  }
)

watch(team, (newTeam) => {
  emit('item', newTeam)
})
</script>
