export default eventHandler(async (event) => {
    const query = getQuery(event);

    if (query.name) {
        const response = await $fetch(`https://proclubs.ea.com/api/nhl/clubs/search?platform=common-gen5&clubName=${query.name}`);
        
        if (response) {
            const clubs = Object.values(response); // or use map/entries to include key
            return clubs;
        }
    }

    return [];
});
