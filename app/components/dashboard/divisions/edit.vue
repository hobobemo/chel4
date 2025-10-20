<script setup>
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
    id: props?.item?.id,
    name: props?.item?.name,
    logo: props?.item?.logo,
    isActive: props?.item?.isActive,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
});

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/divisions', {
        method: 'PUT',
        body: formData.value,
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
      leagueStore.editDivision(formData.value);
      isLoading.value = false;
      isOpen.value = false;
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="`Edit Division ${props?.item?.name}`">
        <UButton icon="i-lucide-square-pen" size="md" variant="outline" class="rounded-full" />

        <template #body>
              <UForm :state="formData" @submit="handleSubmit">
                <UFormField label="Division Name" name="name">
                    <UInput v-model="formData.name" :placeholder="props?.item?.name"/>
                </UFormField>
                <UButton loading-auto type="submit" variant="outline" label="Edit" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>