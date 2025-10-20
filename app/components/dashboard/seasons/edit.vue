<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { CalendarDate } from '@internationalized/date'

// Nuxt will auto-import these from ~/composables/useScheduleGenerator.ts
// timestampToCalendarDate()
// calendarDateToTimestamp()

const props = defineProps({
  item: { type: Object, required: true }
})

const isLoading = ref(false)
const isOpen = ref(false)
const leagueStore = useLeagueStore()
const userStore = useUserStore()

// Main form data — timestamps stored for submission
const formData = ref({
  id: props.item.id,
  name: props.item.name ?? '',
  startDate: Number(props.item.startDate) || null,
  endDate: Number(props.item.endDate) || null,
  registrationStart: Number(props.item.registrationStart) || null,
  registrationEnd: Number(props.item.registrationEnd) || null,
  draftDate: Number(props.item.draftDate) || null,
  isActive: props.item.isActive,
  leagueId: leagueStore.getLeagueId,
  userId: userStore.getId
})

// CalendarDate refs for the pickers
const startDate = ref<CalendarDate | null>(null)
const endDate = ref<CalendarDate | null>(null)
const registrationStart = ref<CalendarDate | null>(null)
const registrationEnd = ref<CalendarDate | null>(null)
const draftDate = ref<CalendarDate | null>(null)

// Convert timestamps → CalendarDates on mount
onMounted(() => {
  startDate.value = timestampToCalendarDate(formData.value.startDate)
  endDate.value = timestampToCalendarDate(formData.value.endDate)
  registrationStart.value = timestampToCalendarDate(formData.value.registrationStart)
  registrationEnd.value = timestampToCalendarDate(formData.value.registrationEnd)
  draftDate.value = timestampToCalendarDate(formData.value.draftDate)
})

// Sync CalendarDates → timestamps
watch(startDate, val => (formData.value.startDate = calendarDateToTimestamp(val)))
watch(endDate, val => (formData.value.endDate = calendarDateToTimestamp(val)))
watch(registrationStart, val => (formData.value.registrationStart = calendarDateToTimestamp(val)))
watch(registrationEnd, val => (formData.value.registrationEnd = calendarDateToTimestamp(val)))
watch(draftDate, val => (formData.value.draftDate = calendarDateToTimestamp(val)))

// Submit updated season
async function handleSubmit() {
  isLoading.value = true
  try {
    const response = await $fetch('/api/league/seasons', {
      method: 'PUT',
      body: formData.value,
      headers: { Authorization: `Bearer ${userStore.getToken}` }
    })

    if (response.success === true) {
      leagueStore.editSeason(formData.value)
      isOpen.value = false
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
  <UModal v-model:open="isOpen" :title="`Edit Season - ${formData.name}`">
    <!-- Trigger -->
    <UButton icon="i-lucide-square-pen" size="md" variant="outline" class="rounded-full" />

    <!-- Modal Body -->
    <template #body>
      <UForm :state="formData" @submit="handleSubmit">
        <UFormField label="Season Name">
          <UInput v-model="formData.name" />
        </UFormField>

        <UFormField label="Season Start Date">
          <UPopover>
            <UButton variant="outline" color="secondary">
              {{ formatCalendarDate(startDate) || 'Select Start Date' }}
            </UButton>
            <template #content>
              <UCalendar v-model="startDate" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Season End Date">
          <UPopover>
            <UButton variant="outline" color="secondary">
              {{ formatCalendarDate(endDate) || 'Select End Date' }}
            </UButton>
            <template #content>
              <UCalendar v-model="endDate" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Registration Start">
          <UPopover>
            <UButton variant="outline" color="secondary">
              {{ formatCalendarDate(registrationStart) || 'Select Registration Start' }}
            </UButton>
            <template #content>
              <UCalendar v-model="registrationStart" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Registration End">
          <UPopover>
            <UButton variant="outline" color="secondary">
              {{ formatCalendarDate(registrationEnd) || 'Select Registration End' }}
            </UButton>
            <template #content>
              <UCalendar v-model="registrationEnd" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Draft Date">
          <UPopover>
            <UButton variant="outline" color="secondary">
              {{ formatCalendarDate(draftDate) || 'Select Draft Date' }}
            </UButton>
            <template #content>
              <UCalendar v-model="draftDate" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UButton
          type="submit"
          variant="outline"
          label="Save Changes"
          class="mt-4"
          :loading="isLoading"
        />
      </UForm>
    </template>
  </UModal>
</template>
