<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useLeagueStore } from '@/stores/leagueStore';
import { useCartStore } from '@/stores/cartStore';
import { useStripeStore } from '@/stores/stripeStore';

const colorMode = useColorMode();
const userStore = useUserStore();
const leagueStore = useLeagueStore();
const cartStore = useCartStore();
const stripeStore = useStripeStore();

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - CHEL.gg',
  ogImage: 'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3NhYXMtdGVtcGxhdGUubnV4dC5kZXYiLCJpYXQiOjE3Mzk0NjM0NDh9.tgzUQaw6XswUPPVbOXazuWwoTHJODg155CYt1xfzIdM.jpg?theme=light',
  twitterImage: 'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3NhYXMtdGVtcGxhdGUubnV4dC5kZXYiLCJpYXQiOjE3Mzk0NjM0NDh9.tgzUQaw6XswUPPVbOXazuWwoTHJODg155CYt1xfzIdM.jpg?theme=light',
  twitterCard: 'summary_large_image'
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'), {
  transform: data => data.find(item => item.path === '/docs')?.children || []
});

const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
});

// async function getProducts() {
//   const data = await $fetch('/api/stripe/products');
//   stripeStore.setProducts(data.products);
// }

const links = [{
  label: 'Docs',
  icon: 'i-lucide-book',
  to: '/docs/getting-started'
}, {
  label: 'Pricing',
  icon: 'i-lucide-credit-card',
  to: '/pricing'
}, {
  label: 'Blog',
  icon: 'i-lucide-pencil',
  to: '/blog'
}]

provide('navigation', navigation);

onMounted(async () => {
  if(!userStore){
    userStore;
  }
  if(!leagueStore){
    leagueStore;
  }
  if(!cartStore){
    cartStore;
  }
  if(!stripeStore){
    stripeStore;
  }
  // await getProducts();
})
</script>

<template>
  <ClientOnly>
    <UApp>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </UApp>
  </ClientOnly>
</template>