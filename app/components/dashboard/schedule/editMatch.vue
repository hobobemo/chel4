<script setup lang="ts">
import { fromDate, CalendarDate } from '@internationalized/date'

const emit = defineEmits(['action'])
const leagueStore = useLeagueStore();
const userStore = useUserStore();
const isLoading = ref(false);
const isOpen = ref(false);
const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

let item = ref(null);
let formData = ref({
    id: props?.item?.schedule?.id,
    homeId: props?.item?.schedule?.homeId,
    awayId: props?.item?.schedule?.awayId,
    seasonId: props?.item?.schedule?.seasonId,
    gameType: props?.item?.schedule?.gameType,
    gameTime: props?.item?.schedule?.gameTime,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
});

const gameTime = ref(null)

// Initialize pickers from formData timestamps
onMounted(() => {
  gameTime.value = timestampToCalendarDate(formData.value.gameTime)
})

// Watch pickers and sync to formData
watch(gameTime, val => (formData.value.gameTime = calendarDateToTimestamp(val)))

// Helpers
function timestampToCalendarDate(ts: number | string | null | undefined): CalendarDate | null {
  const num = Number(ts)
  if (!num || isNaN(num)) return null

  const jsDate = new Date(num)
  if (isNaN(jsDate.getTime())) return null

  return fromDate(jsDate)
}

function calendarDateToTimestamp(cd: CalendarDate | null): number | null {
  if (!cd) return null
  const d = cd.toDate?.() ?? new Date(cd.year, cd.month - 1, cd.day)
  return d.getTime()
}

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/schedules', {
        method: 'PUT',
        body: formData.value,
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
      isLoading.value = false;
      isOpen.value = false;
        emit('action');
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" title="Edit Match">
        <UButton size="sm" class="rounded-full" variant="outline" color="primary">Edit</UButton>

        <template #body>
            <UForm :state="formData" @submit="handleSubmit">
                    <div class="flex flex-wrap gap-6">
                        <UFormField label="Season" name="division">
                            <USelect v-model="formData.seasonId" :items="leagueStore.getSeasonsMenu" class="w-48" :placeholder="props.item.schedule.seasonId"/>
                        </UFormField>
                        <UFormField label="Game Date">
                            <UPopover>
                                <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
                                    {{ gameTime ? `${gameTime.year}-${gameTime.month}-${gameTime.day}` : 'Select Start Date' }}
                                </UButton>

                                <template #content>
                                    <UCalendar v-model="gameTime" class="p-2" />
                                </template>
                            </UPopover>
                        </UFormField>
                    </div>
                    <div class="flex flex-wrap gap-6">
                        <UFormField label="Away Team" name="team">
                            <USelect v-model="formData.awayId" :items="leagueStore.getTeamsMenu" class="w-48" />
                        </UFormField>

                        <UFormField label="Home Team" name="division">
                            <USelect v-model="formData.homeId" :items="leagueStore.getTeamsMenu" class="w-48" />
                        </UFormField>
                    </div>
                <UButton loading-auto type="submit" variant="outline" label="Edit" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>