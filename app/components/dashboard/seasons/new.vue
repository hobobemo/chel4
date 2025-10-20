<script setup lang="ts">
import { ref, watch } from 'vue'

// These are auto-imported by Nuxt from your composables/useScheduleGenerator.ts:
// toTimestamp()
// (also available if you ever need timestampToCalendarDate, etc.)

const leagueStore = useLeagueStore()
const userStore = useUserStore()

const isLoading = ref(false)
const isOpen = ref(false)

// Calendar date refs (UCalendar uses { year, month, day })
const startDate = ref<{ year: number; month: number; day: number } | null>(null)
const endDate = ref<{ year: number; month: number; day: number } | null>(null)
const registrationStart = ref<{ year: number; month: number; day: number } | null>(null)
const registrationEnd = ref<{ year: number; month: number; day: number } | null>(null)
const draftDate = ref<{ year: number; month: number; day: number } | null>(null)

// Form data — stores timestamps for API submission
const formData = ref({
  name: '',
  startDate: null as number | null,
  endDate: null as number | null,
  registrationStart: null as number | null,
  registrationEnd: null as number | null,
  draftDate: null as number | null,
  isActive: 1,
  leagueId: leagueStore.getLeagueId,
  userId: userStore.getId,
})

// Reset everything
function clearForm() {
  formData.value = {
    name: '',
    startDate: null,
    endDate: null,
    registrationStart: null,
    registrationEnd: null,
    draftDate: null,
    isActive: 1,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId,
  }

  startDate.value = null
  endDate.value = null
  registrationStart.value = null
  registrationEnd.value = null
  draftDate.value = null
}

// Watch date refs → sync timestamps
watch(startDate, val => (formData.value.startDate = toTimestamp(val)))
watch(endDate, val => (formData.value.endDate = toTimestamp(val)))
watch(registrationStart, val => (formData.value.registrationStart = toTimestamp(val)))
watch(registrationEnd, val => (formData.value.registrationEnd = toTimestamp(val)))
watch(draftDate, val => (formData.value.draftDate = toTimestamp(val)))

// Format for readable display (YYYY-MM-DD)
function formatDate(dateObj: { year: number; month: number; day: number } | null) {
  if (!dateObj) return ''
  const y = dateObj.year
  const m = String(dateObj.month).padStart(2, '0')
  const d = String(dateObj.day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Submit
async function handleSubmit() {
  isLoading.value = true
  try {
    const response = await $fetch('/api/league/seasons', {
      method: 'POST',
      body: formData.value,
      headers: { Authorization: `Bearer ${userStore.getToken}` },
    })

    if (response.success === true) {
      leagueStore.addSeason(response.id, formData.value)
      isOpen.value = false
      clearForm()
    } else {
      console.error('Submit failed:', response)
    }
  } catch (err) {
    console.error('Error submitting:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="formData.name ? `Add Season - ${formData.name}` : 'Add Season'"
  >
    <!-- Trigger -->
    <UButton icon="i-lucide-plus" size="md" variant="outline" class="rounded-full" />

    <!-- Body -->
    <template #body>
      <UForm :state="formData" @submit="handleSubmit">
        <UFormField label="Season Name">
          <UInput v-model="formData.name" />
        </UFormField>

        <UFormField label="Season Start Date">
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{ formatDate(startDate) || 'Select Start Date' }}
            </UButton>
            <template #content>
              <UCalendar v-model="startDate" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Season End Date">
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{ formatDate(endDate) || 'Select End Date' }}
            </UButton>
            <template #content>
              <UCalendar v-model="endDate" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Registration Start Date">
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{ formatDate(registrationStart) || 'Select Registration Start' }}
            </UButton>
            <template #content>
              <UCalendar v-model="registrationStart" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Registration End Date">
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{ formatDate(registrationEnd) || 'Select Registration End' }}
            </UButton>
            <template #content>
              <UCalendar v-model="registrationEnd" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Draft Date">
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{ formatDate(draftDate) || 'Select Draft Date' }}
            </UButton>
            <template #content>
              <UCalendar v-model="draftDate" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UButton
          type="submit"
          variant="outline"
          label="Create"
          class="mt-4"
          :loading="isLoading"
        />
      </UForm>
    </template>
  </UModal>
</template>
