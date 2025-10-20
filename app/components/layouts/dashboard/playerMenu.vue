<script setup>

const props = defineProps({
  collapsed: {
    type: Boolean,
  }
});

const links = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/dashboard/player',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'My Player',
      icon: 'i-lucide-chart-column-big',
      to: '/dashboard/player/me',
      onSelect: () => {
        open.value = false
      }
    },
  ]
]
</script>

<template>
    <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
</template>