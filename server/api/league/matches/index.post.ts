export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  await db.insert(tables.matchResults).values({
    id: body.id,
    matchId: body.matchId,
    leagueId: body.leagueId,
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
  }).run();

  return { success: true };
});
