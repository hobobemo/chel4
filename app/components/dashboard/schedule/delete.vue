<script setup>
const emit = defineEmits(['action'])
const userStore = useUserStore();
const leagueStore = useLeagueStore();
const isLoading = ref(false);
const isOpen = ref(false);
const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
});

let item = ref(null);

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/schedules', {
        method: 'DELETE',
        body: {
            id: props.item.schedule.id,
            leagueId: leagueStore.getLeagueId
        },
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
    <UModal v-model:open="isOpen" title="Delete Match">
        <UButton size="sm" class="rounded-full" color="error" variant="outline">Delete</UButton>

        <template #body>
            Are you sure that you want to delete this match?
        </template>

        <template #footer>
            <UButton loading-auto color="error" variant="outline" @click="handleSubmit">Delete</UButton>
        </template>
    </UModal>
</template>