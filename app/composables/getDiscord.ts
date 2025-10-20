export const getDiscordUrl = () => {
    return 'https://discord.com/api/users';
}

export const getDiscordImage = (id, image) => {
    return `https://cdn.discordapp.com/avatars/${id}/${image}.png`;
}

export const getDiscordGuildImage = (id, image) => {
    return `https://cdn.discordapp.com/icons/${id}/${image}.png`;
}

export const decodePermissions = (perm) => {
    const permissionFlags = {
        CREATE_INSTANT_INVITE:      1n << 0n,
        KICK_MEMBERS:               1n << 1n,
        BAN_MEMBERS:                1n << 2n,
        ADMINISTRATOR:              1n << 3n,
        MANAGE_CHANNELS:            1n << 4n,
        MANAGE_GUILD:               1n << 5n,
        ADD_REACTIONS:              1n << 6n,
        VIEW_AUDIT_LOG:             1n << 7n,
        PRIORITY_SPEAKER:           1n << 8n,
        STREAM:                     1n << 9n,
        VIEW_CHANNEL:               1n << 10n,
        SEND_MESSAGES:              1n << 11n,
        MANAGE_MESSAGES:            1n << 13n,
        EMBED_LINKS:                1n << 14n,
        ATTACH_FILES:               1n << 15n,
        READ_MESSAGE_HISTORY:       1n << 16n,
        MENTION_EVERYONE:           1n << 17n,
        USE_EXTERNAL_EMOJIS:        1n << 18n,
        CONNECT:                    1n << 20n,
        SPEAK:                      1n << 21n,
        MUTE_MEMBERS:               1n << 22n,
        DEAFEN_MEMBERS:             1n << 23n,
        MOVE_MEMBERS:               1n << 24n,
        USE_VAD:                    1n << 25n,
        MANAGE_ROLES:               1n << 28n,
        MANAGE_WEBHOOKS:            1n << 29n,
        MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
        MANAGE_THREADS:             1n << 34n,
        USE_APPLICATION_COMMANDS:   1n << 31n,
        REQUEST_TO_SPEAK:           1n << 32n,
        MANAGE_EVENTS:              1n << 33n,
        // ... add more as needed
    };
    const perms = BigInt(perm);
    const permissions = Object.entries(permissionFlags)
        .filter(([name, bit]) => (perms & bit) !== 0n)
        .map(([name]) => name);

    if(permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD")){
        return true;
    } else {
        false
    }
}
