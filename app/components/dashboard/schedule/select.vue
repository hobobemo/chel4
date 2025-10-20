<script setup lang="ts">
const emit = defineEmits(['action'])
const leagueStore = useLeagueStore();
const userStore = useUserStore();
const isLoading = ref(false);
const isOpen = ref(false);
const options = ref(null);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

const homeId = props.item.schedule.homeId;
const awayId = props.item.schedule.awayId;
const scheduledTimestamp = props.item.schedule.timestamp;

const timeWindowStart = scheduledTimestamp - 86400; // 24 hours before
const timeWindowEnd = scheduledTimestamp + 86400;   // 24 hours after

let item = ref(null);
let formData = ref({

});

async function similarMatches(){
    options.value = await $fetch('/api/league/matches', {
        method: 'GET',
        query: {
            leagueId: leagueStore.getLeagueId,
            clubId: props?.item?.schedule?.homeId,
            opponentClubId: props?.item?.schedule?.awayId,
            timestamp: props?.item?.schedule?.gameTime
        },
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    })
}

async function handleSubmit(){
    // isLoading.value = true;
    // const response = await $fetch('/api/league/schedules', {
    //     method: 'PUT',
    //     body: formData.value,
    //     headers: {
    //         Authorization: `Bearer ${userStore.getToken}`
    //     }
    // });

    // if (response.success = true) {
    //   isLoading.value = false;
    //   isOpen.value = false;
    //     emit('action');
    // } else {
    //     item.value = 'error'
    // }
}

onMounted(() => {
    similarMatches();
})
</script>

<template>
    <UModal v-model:open="isOpen" title="Select Match Results">
        <UButton size="sm" class="rounded-full" variant="outline" color="success">Select</UButton>

        <template #body>
            {{ options }}
            <!-- <UForm :state="formData" @submit="handleSubmit">
                    <div class="flex flex-wrap gap-6">

                    </div>
                <UButton loading-auto type="submit" variant="outline" label="Edit" class="mt-4" />
            </UForm> -->
        </template>
    </UModal>
</template>