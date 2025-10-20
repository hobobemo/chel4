export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const config = useRuntimeConfig();

  const link = {
      icon: "i-mdi:account-circle",
      href: `https://discord.com/oauth2/authorize?client_id=${config.public.discordClient}&response_type=code&redirect_uri=${config.public.BASE_URL + '/auth/user'}&scope=identify+guilds+email+connections`
  }

  if (!userStore.isAuth) {
    return navigateTo('/auth/error');
  }
});