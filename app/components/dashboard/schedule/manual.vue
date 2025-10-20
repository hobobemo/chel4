<script setup lang="ts">
import { idText } from 'typescript';

const emit = defineEmits(['action'])
const leagueStore = useLeagueStore();
const userStore = useUserStore();
const isLoading = ref(false);
const timestamp = Math.floor(Date.now() / 1000);
const isOpen = ref(false);
const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

let item = ref(null);
let formData = ref({
    matchId: timestamp + "" + props?.item?.schedule?.homeId + props?.item?.schedule?.awayId,
    leagueId: leagueStore.getLeagueId,
    seasonId: props?.item?.schedule?.seasonId,
    isCustom: 1,
    timestamp: timestamp,
    clubId: props?.item?.schedule?.homeId,
    opponentClubId: props?.item?.schedule?.awayId,
    garaw: 0,
    gfraw: 0,
    memberString: null,
    score: 0,
    opponentScore: 0,
    teamSide: 1,
    toa: 0,
    winnerByDnf: 0,
    winnerByGoalieDnf: 0,
    goals: 0,
    goalsAgainst: 0,
    gameId: props?.item?.schedule?.id,
    ogMatchId: null,
    userId: userStore.getId,
    ot: 0,
});

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/matches', {
        method: 'POST',
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

function setScore(team, score){
    switch (team) {
        case props.item.schedule.homeId:
            formData.value.gfraw = score;
            formData.value.score = score;
            formData.value.goals = score;
            break;
        case props.item.schedule.awayId:
            formData.value.garaw = score;
            formData.value.opponentScore = score;
            formData.value.goalsAgainst = score;
            break;
    }
}

function setCheckbox(item, value){
    switch (item) {
        case 'ot':
            formData.value.ot = value ? 1 : 0;
            break;
        case 'winnerByDnf':
            formData.value.winnerByDnf = value ? 1 : 0;
            break;
        case 'winnerByGoalieDnf':
            formData.value.winnerByGoalieDnf = value ? 1 : 0;
            break;
    }
}

</script>

<template>
    <UModal v-model:open="isOpen" title="Match Manual Results">
        <UButton size="sm" class="rounded-full" variant="outline" color="secondary">Manual</UButton>

        <template #body>
            <UForm :state="formData" @submit="handleSubmit">
                    <div class="flex flex-wrap gap-6">
                        <UFormField :label="leagueStore.getTeamByClubId(props.item.schedule.awayId).name" name="away">
                            <UInput @update:modelValue="setScore(props?.item?.schedule?.awayId, $event)" :items="leagueStore.getSeasonsMenu" class="w-48" />
                        </UFormField>
                        <UFormField :label="leagueStore.getTeamByClubId(props.item.schedule.homeId).name" name="home">
                            <UInput @update:modelValue="setScore(props?.item?.schedule?.homeId, $event)" :items="leagueStore.getSeasonsMenu" class="w-48" />
                        </UFormField>
                    </div>
                    <UFormField label="Overtime" name="ot">
                        <UCheckbox @update:modelValue="setCheckbox('ot', $event)" />
                    </UFormField>   
                    <UFormField label="Win by Skater DNF" name="dnf">
                        <UCheckbox @update:modelValue="setCheckbox('winnerByDnf', $event)" />
                    </UFormField>   
                    <UFormField label="Win by Goalie DNF" name="goalieDnf">
                        <UCheckbox @update:modelValue="setCheckbox('winnerByGoalieDnf', $event)" />
                    </UFormField>          
                <UButton loading-auto type="submit" variant="outline" label="Save" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>