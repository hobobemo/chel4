import { eq, and } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const db = useDrizzle();
  const query = getQuery(event);

  // Extract query parameters
  const leagueId = query.leagueId ? Number(query.leagueId) : null;
  const id = query.id ? Number(query.id) : null;

  if (!leagueId) {
    throw createError({ statusCode: 400, message: 'Missing required League ID' });
  }

  // Conditional fetch
  if (id) {
    // Get specific division by id and league_id
    const result = await db
      .select()
      .from(tables.divisions)
      .where(and(
        eq(tables.divisions.leagueId, leagueId),
        eq(tables.divisions.id, id)
      ))
      .get();

    return result;
  } else {
    // Get all divisions for the league
    const result = await db
      .select()
      .from(tables.divisions)
      .where(eq(tables.divisions.leagueId, leagueId))
      .all();

    return result;
  }
});
