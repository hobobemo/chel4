<script setup>
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
    const response = await $fetch('/api/league/divisions', {
        method: 'DELETE',
        body: {
            id: props.item.id,
            leagueId: leagueStore.getLeagueId
        },
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
        leagueStore.deleteDivision(props.item.id)
        isLoading.value = false;
        isOpen.value = false;
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="'Delete ' + props.item.name">
        <UButton icon="i-lucide-trash" color="error" size="sm" variant="outline" class="rounded-full"/>

        <template #body>
            Are you sure that you want to delete {{ props.item.name }}?
        </template>

        <template #footer>
            <UButton loading-auto color="error" variant="outline" @click="handleSubmit">Delete</UButton>
        </template>
    </UModal>
</template>