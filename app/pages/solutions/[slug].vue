<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => queryCollection('solutions').path(route.path).first());

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
  <div v-if="page">
    <SharedHeader :title="page.hero.title" :description="page.hero.description" :links="page.hero.links" :image="page.hero.image" />

    <UPageSection :description="page.features.description">
      <template #title>
        <MDC :value="page.features.title" />
      </template>

      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

  </div>
</template>