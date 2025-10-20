<script setup lang="ts">
const { data } = await useFetch('/api/leagues');

</script>

<template>
  <div v-for="(a, i) in data" :key="i">
      {{ a }}
  </div>
</template>