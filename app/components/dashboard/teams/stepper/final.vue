<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: false,
    }
});
</script>

<template>
    <UFormField label="EA Name">
      <UInput v-model="props.item.eaName" placeholder="EA Team Name" disabled />
    </UFormField>
    <UFormField label="Site Display Name">
      <UInput v-model="props.item.name" placeholder="Display Name" disabled />
    </UFormField>
    <UFormField label="Team Abbreviation">
      <UInput v-model="props.item.abbr" placeholder="Abbreviation" disabled />
    </UFormField>
</template>