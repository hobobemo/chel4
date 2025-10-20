import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
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
      .from(tables.seasons)
      .where(and(
        eq(tables.seasons.leagueId, leagueId),
        eq(tables.seasons.id, id)
      ))
      .get();

    return result;
  } else {
    const result = await db
      .select()
      .from(tables.seasons)
      .where(eq(tables.seasons.leagueId, leagueId))
      .all();

    return result;
  }
});
