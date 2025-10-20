<script setup>
  const appConfig = useAppConfig();
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const router = useRouter();

const props = defineProps({
  collapsed: {
    type: Boolean
  }
});

const link = `https://discord.com/api/oauth2/authorize?client_id=${config.public.discordClient}&redirect_uri=${config.public.BASE_URL}/auth/user&response_type=code&scope=identify%20guilds%20email%20connections`;

const user = {
  name: userStore.getGlobalName,
  avatar: {
    src: getDiscordImage(userStore.getId, userStore.getAvatar),
    alt: userStore.getGlobalName
  }
}

const items = computed(() => ([
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-panels-top-left',
      to: '/dashboard'
    },{
      label: 'Account',
      icon: 'i-lucide-user',
      to: '/dashboard/account'
    }, {
      label: 'Billing',
      icon: 'i-lucide-credit-card',
      to: '/dashboard/account/billing'
    },
  ], [
    {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      to: '/docs/getting-started',
      target: '_blank'
    },
  ], [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect() {
        userStore.removeUser();
        router.push({ path: "/" });
      }
    }
  ]]))

  function handleClick(item) {
  if (item && typeof item.click === 'function') {
    item.click()
  } else {
    console.warn('Clicked item has no click handler:', item)
  }
}
</script>

<template>
  <UButton v-if="!userStore.getAuth" icon="i-simple-icons-discord" color="gray" variant="solid" :to="link" />
  <UDropdownMenu v-else :items="items" :content="{ align: 'center', collisionPadding: 12 }" :ui="{ content: collapsed ? 'w-8' : 'w-(--reka-dropdown-menu-trigger-width)' }" @select="handleClick">
    <UButton v-bind="{ ...user, label: collapsed ? undefined : user?.name, trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down' }" variant="ghost" block :square="collapsed" :ui="{ trailingIcon: 'text-dimmed' }" />
    <template #chip-leading="{ item }">
      <span class="ms-0.5 size-2 rounded-full" />
    </template>
  </UDropdownMenu>
</template>