<script setup>
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
    const response = await $fetch('/api/stripe/subscriptions/cancel', {
        method: 'DELETE',
        body: {
            subscriptionId: props.item.id,
        }
    });

    if (response.success = true) {
        isLoading.value = false;
        isOpen.value = false;
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" title="Cancel Subscription">
        <UButton icon="i-lucide-trash" color="error" size="sm" variant="outline" class="rounded-full" />

        <template #body>
            Are you sure that you want to cancel the subscription <strong>{{ props.item.id }}</strong>?
        </template>

        <template #footer>
            <UButton loading-auto color="error" variant="outline" @click="handleSubmit">Cancel</UButton>
        </template>
    </UModal>
</template>