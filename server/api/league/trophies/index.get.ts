import { eq, and } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const db = useDrizzle();
  const query = getQuery(event);
  const leagueId = query.leagueId ? Number(query.leagueId) : null;
  const id = query.id ? Number(query.id) : null;

  if (!leagueId) {
    throw createError({ statusCode: 400, message: 'Missing required League ID' });
  }

  if (id) {
    const result = await db
      .select()
      .from(tables.trophies)
      .where(and(
        eq(tables.trophies.leagueId, leagueId),
        eq(tables.trophies.id, id)
      ))
      .get();

    return result;
  } else {
    const result = await db
      .select()
      .from(tables.trophies)
      .where(eq(tables.trophies.leagueId, leagueId))
      .all();

    return result;
  }
});
