<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => queryCollection('legal').path(route.path).first());

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})
</script>

<template>
  <div v-if="page" class="prose mx-auto p-6 max-w-3xl">
    <h1 class="text-3xl font-bold mb-4">{{ page.title }}</h1>
    <p class="text-sm text-gray-500 mb-8">
      Effective: {{ page.effective_date }} <span v-if="page.updated">| Updated: {{ page.updated }}</span>
    </p>

    <div v-for="(section, i) in page.sections" :key="i" class="mb-8">
      <h2 class="text-2xl font-semibold mb-2">{{ section.heading }}</h2>
      <p class="text-gray-700 whitespace-pre-line">{{ section.body }}</p>
    </div>
  </div>

  <div v-else class="p-6 text-center text-gray-500">Loading policy...</div>
</template>
