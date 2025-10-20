<script setup lang="ts">
import { toRaw } from 'vue'
import { daysOfTheWeek, gameTypes, timeOptions, getWeekCount } from '~/composables/getScheduleInfo'

const userStore = useUserStore()
const leagueStore = useLeagueStore()

useHead({
  title: leagueStore.getLeagueName + ' - Schedule Generator'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const isLoading = ref(false)
const item = ref(null)

// 🧱 Form Data
const formData = ref({
  leagueId: leagueStore.getLeagueId,
  seasonId: null,
  gameType: null,
  daysOfTheWeek: [],
  matchTimes: [],
  teams: [],
  userId: userStore.getId,
})

// 🧭 Selected season
const selectedSeason = computed(() =>
  leagueStore.getSeasons.find(season => season.id === formData.value.seasonId)
)

// 🧩 Update teams automatically when active teams change
watch(
  () => leagueStore.getActiveTeams,
  (newTeams) => {
    formData.value.teams = newTeams.map(team => team.clubId)
  },
  { immediate: true }
)

// 🧮 Format timestamps for date inputs
function formatTimestampToDate(ts: number | null | undefined) {
  if (ts === null || ts === undefined || isNaN(Number(ts))) return ''
  const d = new Date(Number(ts))
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 🧮 Compute weeks between start and end
const weekCount = computed(() => {
  if (!selectedSeason.value?.startDate || !selectedSeason.value?.endDate) return 0
  return getWeekCount(Number(selectedSeason.value.startDate), Number(selectedSeason.value.endDate))
})

async function handleSubmit() {
  isLoading.value = true

  try {
    const season = leagueStore.getSeasons.find(
      s => s.id === formData.value.seasonId
    )

    if (!season) {
      console.error('❌ No valid season selected')
      return
    }

    // Clean reactive data
    const cleanTeams = toRaw(formData.value.teams)
    const cleanTimes = toRaw(formData.value.matchTimes)
    const cleanDays = toRaw(formData.value.daysOfTheWeek).map(
      d => (typeof d === 'string' ? d : d.id)
    )

    const seasonStart = Number(season?.startDate)
    const seasonEnd = Number(season?.endDate)

    // Generate schedule
    const schedule = generateBalancedSchedule({
      leagueId: formData.value.leagueId,
      seasonId: formData.value.seasonId!,
      userId: formData.value.userId!,
      gameType: formData.value.gameType!,
      gameDays: cleanDays,
      matchTimes: cleanTimes,
      teams: cleanTeams,
      seasonStart,
      seasonEnd,
    })

    if (!schedule.length) {
      console.warn('⚠️ No schedule generated.')
      return
    }

    console.log('✅ Generated schedule:', schedule)

    // 🔥 Submit to API
    const response = await $fetch('/api/league/schedules/bulk', {
      method: 'POST',
      body: { schedule },
      headers: {
        Authorization: `Bearer ${userStore.getToken}`,
      },
    })

    if (response.success) {
      console.log(`🧾 Saved ${response.count} games to DB`)
    } else {
      console.error('❌ API error:', response)
    }

  } catch (err) {
    console.error('❌ Error generating or saving schedule:', err)
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <UDashboardPanel>
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="Schedule Generator" />
    </template>

    <!-- Body -->
    <template #body>
      <UForm :state="formData" @submit="handleSubmit">
        <!-- 🔹 Season & Dates -->
        <div class="flex flex-wrap gap-6 items-end">
          <UFormField label="Season">
            <USelect
              v-model="formData.seasonId"
              :items="leagueStore.getSeasonsMenu"
              placeholder="Select Season"
              class="w-48"
            />
          </UFormField>

          <UFormField label="Start Date" v-if="formData.seasonId">
            <UInput
              type="date"
              :model-value="formatTimestampToDate(selectedSeason?.startDate)"
              disabled
              class="w-48"
            />
          </UFormField>

          <UFormField label="End Date" v-if="formData.seasonId">
            <UInput
              type="date"
              :model-value="formatTimestampToDate(selectedSeason?.endDate)"
              disabled
              class="w-48"
            />
          </UFormField>

          <UFormField label="Weeks" v-if="formData.seasonId">
            <UInput :model-value="weekCount" disabled class="w-32" />
          </UFormField>

          <UFormField label="Game Type" v-if="formData.seasonId">
            <USelectMenu
              v-model="formData.gameType"
              value-key="id"
              :items="gameTypes()"
              class="w-48"
            />
          </UFormField>
        </div>

        <!-- 🔹 Game Days & Times -->
        <div class="flex flex-wrap gap-6 items-end" v-if="formData.seasonId">
          <UFormField label="Game Days">
            <USelectMenu
              v-model="formData.daysOfTheWeek"
              value-key="id"
              multiple
              :items="daysOfTheWeek()"
              class="w-96"
            />
          </UFormField>

          <UFormField label="Game Times">
            <USelectMenu
              v-model="formData.matchTimes"
              multiple
              :items="timeOptions()"
              class="w-96"
            />
          </UFormField>
        </div>

        <!-- 🔹 Active Teams -->
        <div class="flex flex-wrap gap-6 items-end" v-if="formData.seasonId">
          <UFormField label="Active Teams">
            <ul class="list-disc list-inside text-sm">
              <li
                v-for="team in leagueStore.getActiveTeams"
                :key="team.id"
              >
                {{ team.name }}
              </li>
            </ul>
          </UFormField>
        </div>

        <!-- 🔹 Submit -->
        <UButton
          type="submit"
          label="Generate Schedule"
          class="mt-6"
          :loading="isLoading"
        />
      </UForm>
    </template>
  </UDashboardPanel>
</template>
