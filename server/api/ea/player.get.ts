export default eventHandler(async (event) => {
    const query = getQuery(event);

    if (query.name) {
        const response = await $fetch(`https://proclubs.ea.com/api/nhl/members/search?platform=common-gen5&memberName=${query.name}`);
        
        if (response) {
            const items = Object.values(response); // or use map/entries to include key
            return items;
        }
    }

    return [];
});
