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
    clubId: props?.item?.clubId,
    name: props?.item?.name,
    eaName: props?.item?.eaName,
    abbr: props?.item?.abbr,
    logo: props?.item?.logo,
    divisionId: props?.item?.divisionId,
    logoType: props?.item?.logoType,
    useBaseAsset: props?.item?.useBaseAsset,
    crestAssetId: props?.item?.crestAssetId,
    isCustomTeam: props?.item?.isCustomTeam,
    playerRole: props?.item?.playerRole,
    gmRole: props?.item?.gmRole,
    agmRole: props?.item?.agmRole,
    isActive: props?.item?.isActive,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
});

async function handleSubmit(){
    isLoading.value = true;
    const response = await $fetch('/api/league/teams', {
        method: 'PUT',
        body: formData.value,
        headers: {
            Authorization: `Bearer ${userStore.getToken}`
        }
    });

    if (response.success = true) {
      leagueStore.editTeam(formData.value);
      isLoading.value = false;
      isOpen.value = false;
    } else {
        item.value = 'error'
    }
}
</script>

<template>
    <UModal v-model:open="isOpen">
        <UButton icon="i-lucide-square-pen" size="md" variant="outline" class="rounded-full" />

        <template #title>
            <div class="flex items-center gap-3">
                <NuxtImg width="32" height="32" class="rounded" :src="getTeamLogo({ crestAssetId: props?.item?.crestAssetId, useBaseAsset: props?.item?.useBaseAsset, isCustomTeam: props?.item?.isCustomTeam })" />
                <span class="font-medium text-lg">{{ props?.item?.name }}</span>
            </div>
        </template>

        <template #body>
              <UForm :state="formData" @submit="handleSubmit">
                <UFormField label="Display Name" name="name">
                    <UInput v-model="formData.name" :placeholder="props?.item?.name"/>
                </UFormField>
                <UFormField label="Abbreviation" name="name">
                    <UInput v-model="formData.abbr" :placeholder="props?.item?.abbr"/>
                </UFormField>
                <UButton loading-auto type="submit" variant="outline" label="Edit" class="mt-4" />
            </UForm>
        </template>
    </UModal>
</template>