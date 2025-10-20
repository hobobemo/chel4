import { and, eq, gte, lte } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const query = getQuery(event);

  const leagueId = query.leagueId ? Number(query.leagueId) : null;
  const id = query.id?.toString();
  const clubId = query.clubId ? Number(query.clubId) : null;
  const opponentClubId = query.opponentClubId ? Number(query.opponentClubId) : null;
  const timestamp = query.timestamp ? Number(query.timestamp) : null;

  if (!leagueId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'leagueId is required'
    });
  }

  if (id) {
    const match = await db
      .select()
      .from(tables.matchResults)
      .where(and(
        eq(tables.matchResults.leagueId, leagueId),
        eq(tables.matchResults.id, id)
      ))
      .get();

    return match;
  }

  let conditions = [eq(tables.matchResults.leagueId, leagueId)];

  if (clubId !== null) {
    conditions.push(eq(tables.matchResults.clubId, clubId));
  }

  if (opponentClubId !== null) {
    conditions.push(eq(tables.matchResults.opponentClubId, opponentClubId));
  }

  if (timestamp !== null) {
    const oneDay = 86400; // seconds in 24 hours
    conditions.push(
      gte(tables.matchResults.timestamp, timestamp - oneDay),
      lte(tables.matchResults.timestamp, timestamp + oneDay)
    );
  }

  const matches = await db
    .select()
    .from(tables.matchResults)
    .where(and(...conditions))
    .all();

  return matches;
});
