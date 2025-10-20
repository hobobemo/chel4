<script setup lang="ts">
const emit = defineEmits(['action'])
const leagueStore = useLeagueStore();
const userStore = useUserStore();
const isLoading = ref(false);
const isOpen = ref(false);

const gameTime = ref<{ year: number; month: number; day: number } | null>(null);

let item = ref(null);
let formData = ref({
    homeId: 0,
    awayId: 0,
    seasonId: 0,
    gameType: 1,
    gameTime: null as number | null,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
});

function clearForm(){
    formData.value = {
        homeId: 0,
        awayId: 0,
        seasonId: 0,
        gameType: 1,
        gameTime: null as number | null,
        leagueId: leagueStore.getLeagueId,
        userId: userStore.getId
    }
}

function toTimestamp(dateObj: { year: number; month: number; day: number } | null) {
  if (!dateObj) return null;
  return new Date(dateObj.year, dateObj.month - 1, dateObj.day).getTime();
}

// Watch all date refs and update formData timestamps
watch(gameTime, val => formData.value.gameTime = toTimestamp(val));

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/schedules', {
        method: 'POST',
        body: formData.value,
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
        isLoading.value = false;
        isOpen.value = false;
        clearForm();
        emit('action');
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" title="New Match">
        <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

        <template #body>
              <UForm :state="formData" @submit="handleSubmit">
                    <div class="flex flex-wrap gap-6">
                        <UFormField label="Season" name="division">
                            <USelect v-model="formData.seasonId" :items="leagueStore.getSeasonsMenu" class="w-48" />
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
                <UButton loading-auto type="submit" variant="outline" label="Create" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>