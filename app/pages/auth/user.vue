<script setup>
    useHead({
        title: 'Authorizing User'
    })
    
    const userStore = useUserStore();
    const config = useRuntimeConfig();
    const route = useRoute();
    const router = useRouter();

    let isLoading = ref(true);
    let customer = ref(null);

    function setDiscordPayload() {
        const payload = new URLSearchParams();
        payload.append('client_id', config.public.discordClient);
        payload.append('client_secret', config.public.discordSecret);
        payload.append('grant_type', 'authorization_code');
        payload.append('code', route.query.code);
        payload.append('redirect_uri', `${config.public.BASE_URL}/auth/user`);
        payload.append('scope', "identify+guilds+email+connections+guilds.join");
        return payload;
    }

    async function getDiscordToken() {
        const postSettings = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        };

        try {
            const response = await $fetch('https://discord.com/api/oauth2/token', {
                method: "POST",
                body: setDiscordPayload(),
                postSettings
            });
            await setUser(response.access_token);
        } catch (error) {
            console.log(error);
        }
    }

    function getDiscordHeaders(token) {
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    async function setUser(token) {
        try {
            const user = await $fetch(`${getDiscordUrl()}/@me`, { method: "GET", headers: getDiscordHeaders(token) });
            const connections = await $fetch(`${getDiscordUrl()}/@me/connections`, { method: "GET", headers: getDiscordHeaders(token) });
            const guilds = await $fetch(`${getDiscordUrl()}/@me/guilds`, { method: "GET", headers: getDiscordHeaders(token) });

            let exists = null;

            try {
                exists = await $fetch(`/api/users/${user.id}`);
            } catch (e) {
                if (e.response?.status === 404) {
                    exists = false;
                } else {
                    throw e; // Unexpected error
                }
            }

            if (exists) {
                await $fetch(`/api/users`, {
                    method: "PUT",
                    body: {
                        id: user.id,
                        username: user.username,
                        global_name: user.global_name,
                        avatar: user.avatar,
                        discriminator: user.discriminator,
                        email: user.email,
                        verified: user.verified,
                        locale: user.locale,
                        mfa_enabled: user.mfa_enabled,
                        premium_type: user.premium_type,
                        connections,
                        guilds
                    }
                });
                userStore.setUser(user, connections, guilds, exists.customerId);

            } else {
                const stripeCustomer = await $fetch('/api/stripe/customer', {
                    method: 'POST',
                    body: {
                        email: user.email,
                        name: user.username,
                    }
                });

                await $fetch(`/api/users`, {
                    method: "POST",
                    body: {
                        id: user.id,
                        username: user.username,
                        global_name: user.global_name,
                        avatar: user.avatar,
                        discriminator: user.discriminator,
                        email: user.email,
                        verified: user.verified,
                        locale: user.locale,
                        mfa_enabled: user.mfa_enabled,
                        premium_type: user.premium_type,
                        connections,
                        guilds,
                        customerId: stripeCustomer.id
                    }
                });
                userStore.setUser(user, connections, guilds, stripeCustomer.id);
            }

            const leagues = await $fetch(`/api/leagues?userId=${user.id}`, {
                headers: {
                    Authorization: `Bearer ${userStore.getToken}` // Replace with your token getter
                }
            });

            userStore.setUserLeagues(leagues);

            // Set the user and customerId in the store
            isLoading.value = false;
            router.push({ path: "/dashboard" });
        } catch (err) {
            console.error("Failed to log in and sync user:", err);
            isLoading.value = false;
        }
    }

    onMounted(async () => {
        await getDiscordToken();
    });
</script>

<template></template>