<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/', // <-- exact match only
  }, {
    label: 'Solutions',
    children: [
      {
        label: 'Leagues',
        to: '/solutions/leagues',
        description: 'Automate stat tracking and score reporting.',
        icon: 'i-lucide-shield',
        active: route.path.startsWith('/solutions/leagues'),
      }, {
        label: 'Teams',
        to: '/solutions/teams',
        description: 'Track your team history, records, and stats.',
        icon: 'i-mdi-hockey-puck',
        active: route.path.startsWith('/solutions/teams'),
      },
    ]
  }, {
    label: 'Documentation',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started'),
  }
])

</script>

<template>
  <UHeader>
    
    <template #left>
      <NuxtLink to="/">
        <LogoPro class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <USeparator />
      <LayoutsUserMenu />
    </template>

  </UHeader>
</template>
