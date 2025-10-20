<script setup lang="ts">
const emit = defineEmits(['item'])
const isLoading = ref(false);

const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
});

let items = ref([]);
let formData = ref({
  name: null,
});
let team = ref(null);

async function getItems(value){
  isLoading.value = true;
  const response = await $fetch(`/api/ea/team?name=${value}`);
  items.value = response.map((item: any) => ({
    eaName: item.clubInfo.name,
    clubId: item.clubInfo.clubId,
    crestAssetId: item.clubInfo.customKit.crestAssetId,
    useBaseAsset: item.clubInfo.customKit.useBaseAsset,
    isCustomTeam: item.clubInfo.customKit.isCustomTeam,
  }))
  isLoading.value = false;
}

watch(() => formData.value.name, (newVal) => {
    getItems(newVal);
});

watch(() => team.value, (newTeam) => {
    emit('item', newTeam)
});
</script>

<template>  
  <UCard v-if="props?.item?.eaName">
    <template #header>
      <NuxtImg :src="getTeamLogo({ crestAssetId: props?.item?.crestAssetId, useBaseAsset: props?.item?.useBaseAsset, isCustomTeam: props?.item?.isCustomTeam })" />
      {{ props.item.eaName }}
    </template>
  </UCard>
  <div v-else>
    <UFormField label="Team Name">
      <UInput :loading="isLoading" v-model="formData.name" placeholder="EA Team Name" />
    </UFormField>
    <UContainer>
      <UPageList>
        <UCard v-for="(a, i) in items" :key="i" @click="team = a">
          <template #header>
            <NuxtImg :src="getTeamLogo({ crestAssetId: a.crestAssetId, useBaseAsset: a.useBaseAsset, isCustomTeam: a.isCustomTeam })" />
            {{ a.eaName }}
          </template>
        </UCard>
      </UPageList>
    </UContainer>  
  </div>
</template>

