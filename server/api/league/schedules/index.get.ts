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
      .select({
        schedule: tables.schedules,
        matchResult: tables.matchResults,
      })
      .from(tables.schedules)
      .leftJoin(
        tables.matchResults,
        eq(tables.matchResults.gameId, tables.schedules.id)
      )
      .where(and(
        eq(tables.schedules.leagueId, leagueId),
        eq(tables.schedules.id, id)
      ))
      .get();

    return result;
  } else {
    const result = await db
      .select({
        schedule: tables.schedules,
        matchResult: tables.matchResults,
      })
      .from(tables.schedules)
      .leftJoin(
        tables.matchResults,
        eq(tables.matchResults.gameId, tables.schedules.id)
      )
      .where(eq(tables.schedules.leagueId, leagueId))
      .all();

    return result;
  }
});
