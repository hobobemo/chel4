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

    const userId = query.userId ? String(query.userId) : null;

    if (userId) {
        // Fetch single league by ID
        const result = await db
            .select()
            .from(tables.leagues)
            .where(eq(tables.leagues.userId, userId))
            .all();

        return result;
    }
});
