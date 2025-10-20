<script setup>
const emit = defineEmits(['item'])
const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
});

let formData = ref({
    name: null,
    abbr: null,
    logoType: 0,
})

watch(() => formData.value, (newVal) => {
      emit('item', newVal);
    }, { 
      deep: true 
    }
);

</script>

<template>
    <UFormField label="EA Name">
      <UInput v-model="props.item.eaName" placeholder="EA Team Name" disabled />
    </UFormField>
    <UFormField label="Site Display Name">
      <UInput v-model="formData.name" placeholder="Display Name" />
    </UFormField>
    <UFormField label="Team Abbreviation">
      <UInput v-model="formData.abbr" placeholder="Abbreviation" />
    </UFormField>
</template>