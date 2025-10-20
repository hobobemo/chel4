import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const query = getQuery(event);

  const conditions = [];
  if (query.leagueId) conditions.push(eq(tables.playerResults.leagueId, Number(query.leagueId)));
  if (query.matchId) conditions.push(eq(tables.playerResults.matchId, String(query.matchId)));
  if (query.playerId) conditions.push(eq(tables.playerResults.playerId, String(query.playerId)));

  if (conditions.length > 0) {
    return await db.select().from(tables.playerResults).where(and(...conditions)).all();
  }

  return await db.select().from(tables.playerResults).all();
});
