<script setup>
const leagueStore = useLeagueStore();
const userStore = useUserStore();
const isLoading = ref(false);
const isOpen = ref(false);

let item = ref(null);
let formData = ref({
    name: null,
    logo: null,
    isActive: 1,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
});

function clearForm(){
    formData.value = {
        name: null,
        logo: null,
        isActive: 1,
        leagueId: leagueStore.getLeagueId,
        userId: userStore.getId
    }
}

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/divisions', {
        method: 'POST',
        body: formData.value,
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
        leagueStore.addDivision(response.id, formData.value);
        isLoading.value = false;
        isOpen.value = false;
        clearForm();
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="!formData.name ? 'Add Division' : 'Add Division - ' + formData.name">
        <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

        <template #body>
              <UForm :state="formData" @submit="handleSubmit">
                    <UFormField label="Division Name" name="name">
                        <UInput v-model="formData.name" />
                    </UFormField>
                <UButton loading-auto type="submit" variant="outline" label="Create" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>