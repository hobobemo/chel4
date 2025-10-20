<script setup>
const userStore = useUserStore();

useHead({
  title: 'Dashboard'
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

</script>

<template>
  <UDashboardPanel>
    <template #header>
        <UDashboardNavbar title="Dashboard"/>
    </template>

    <template #body>
      <UPageGrid>
        <UCard v-for="(a, i) in userStore.getGuilds" :key="i">
          <template #header>
            <div class="flex items-center gap-3">
                <NuxtImg width="32" height="32" class="rounded-full" :src="getDiscordGuildImage(a.id, a.icon)" />
                <span class="font-medium text-lg">{{ a.name }}</span>
            </div>
          </template>
            
          <template #footer>
            <div class="flex gap-4">
              <UButton size="md" icon="i-simple-icons-discord" class="rounded-full" variant="outline" color="primary" disabled>League Bot</UButton>
              <UButton size="md" icon="i-simple-icons-discord" class="rounded-full" variant="outline" color="secondary" disabled>Public Bot</UButton>
            </div>
          </template>
        </UCard>

      </UPageGrid>

    </template>
  </UDashboardPanel>
</template>