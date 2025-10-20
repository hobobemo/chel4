import { eq, and } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createError({ statusCode: 401, message: 'Invalid or missing token' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const license = await useAuth(token);

  if (!license) {
    return createError({ statusCode: 401, message: 'Invalid or inactive license' });
  }

  if (!body.id || !body.leagueId) {
    return createError({ statusCode: 400, message: 'Missing id or leagueId in body' });
  }

  try {
    await db
      .update(tables.matchResults)
      .set({
        matchId: body.matchId,
        seasonId: body.seasonId,
        isCustom: body.isCustom,
        timestamp: body.timestamp,
        clubId: body.clubId,
        opponentClubId: body.opponentClubId,
        garaw: body.garaw,
        gfraw: body.gfraw,
        memberString: body.memberString,
        score: body.score,
        opponentScore: body.opponentScore,
        teamSide: body.teamSide,
        toa: body.toa,
        winnerByDnf: body.winnerByDnf,
        winnerByGoalieDnf: body.winnerByGoalieDnf,
        goals: body.goals,
        goalsAgainst: body.goalsAgainst,
        gameId: body.gameId,
        ogMatchId: body.ogMatchId,
        userId: body.userId,
        ot: body.ot
      })
      .where(eq(tables.matchResults.id, body.id));

    return { success: true };
  } catch (e: any) {
    console.error('Update error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database update failed' });
  }
});
