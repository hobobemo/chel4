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
      .from(tables.teams)
      .where(and(
        eq(tables.teams.leagueId, leagueId),
        eq(tables.teams.id, id)
      ))
      .get();

    return result;
  } else {
    const result = await db
      .select()
      .from(tables.teams)
      .where(eq(tables.teams.leagueId, leagueId))
      .all();

    return result;
  }
});
