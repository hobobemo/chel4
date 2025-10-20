<script setup lang="ts">
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

});

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
</script>

<template>
    <UModal v-model:open="isOpen" title="Edit Match Results">
        <UButton size="sm" class="rounded-full" variant="outline" color="primary">Edit</UButton>

        <template #body>
            {{ props.item }}
            <!-- <UForm :state="formData" @submit="handleSubmit">
                    <div class="flex flex-wrap gap-6">

                    </div>
                <UButton loading-auto type="submit" variant="outline" label="Edit" class="mt-4" />
            </UForm> -->
        </template>
    </UModal>
</template>