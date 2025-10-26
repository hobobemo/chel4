export default eventHandler(async (event) => {
  const db = useDrizzle();
  const query = getQuery(event);

  if (!query.userId) {
    return createError({ statusCode: 400, message: 'Missing userId' });
  }

  // Find all active licenses for this user
  const licenses = await db
    .select()
    .from(tables.licenses)
    .where(eq(tables.licenses.userId, query.userId))
    .all();

  // ✅ Moved this below the check
  if (!licenses || licenses.length === 0) {
    return createError({ statusCode: 404, message: 'No active licenses found for this user' });
  }

  // Extract all license IDs
  const licenseIds = licenses.map(l => l.id);

  // Fetch all leagues associated with those license IDs
  const leagues = await db
    .select()
    .from(tables.leagues)
    .where(inArray(tables.leagues.licenseId, licenseIds))
    .all();

  // Return both license info and leagues for context
  return {
    userId: query.userId,
    licenses,
    leagues
  };
});
