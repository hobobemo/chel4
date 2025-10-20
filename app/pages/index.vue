<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

</script>

<template>
  <div v-if="page">
    <SharedHeader :title="page.hero.title" :description="page.hero.description" :links="page.hero.links" :image="page.hero.image"/>

    <UPageSection :description="page.features.description">
      <template #title>
        <MDC :value="page.features.title" />
      </template>

      <UPageGrid>
        <UPageCard v-for="(item, index) in page.features.items" :key="index" v-bind="item" spotlight />
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden">
      <div class="absolute rounded-full dark:bg-primary blur-[250px] size-40 sm:size-50 transform -translate-x-1/2 left-1/2 -translate-y-80" />
    </UPageCTA>
  </div>
</template>