<script setup>
const leagueStore = useLeagueStore();
const userStore = useUserStore();
const isLoading = ref(false);
const isOpen = ref(false);

let item = ref(null);
let formData = ref({
    name: null,
    desc: null,
    type: 0,
    image: null,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
});

function clearForm(){
  formData.value = {
    name: null,
    desc: null,
    type: 0,
    image: null,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
  }
}

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/trophies', {
        method: 'POST',
        body: formData.value,
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
        leagueStore.addTrophy(response.id, formData.value);
        isLoading.value = false;
        isOpen.value = false;
        clearForm();
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="!formData.name ? 'Add Trophy' : 'Add Trophy - ' + formData.name">
        <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

        <template #body>
              <UForm :state="formData" @submit="handleSubmit">
                    <UFormField label="Trophy Name" name="name">
                        <UInput v-model="formData.name" />
                    </UFormField>
                    <UFormField label="Trophy Description" name="desc">
                        <UTextarea v-model="formData.desc" />
                    </UFormField>
                <UButton loading-auto type="submit" variant="outline" label="Create" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>