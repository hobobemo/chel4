export default eventHandler(async (event) => {
    const db = useDrizzle();
    const query = getQuery(event);
    
    const authHeader = getHeader(event, 'authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return createError({ statusCode: 401, message: 'Invalid or missing token' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const license = await useAuth(token);

    if(!license) {
        return createError({ statusCode: 401, message: 'Invalid or inactive License' });
    }

    const id = query.id ? Number(query.id) : null;

    if (id) {
        // Fetch single league by ID
        const result = await db
        .select()
        .from(tables.leagues)
        .where(and(
            eq(tables.leagues.id, id), 
            eq(tables.leagues.licenseId, license))
        )
        .get();

        return result;
    } else {
        // Fetch all leagues
        const result = await db
        .select()
        .from(tables.leagues)
        .where(eq(tables.leagues.licenseId, license))
        .all();

        return result;
    }
});
