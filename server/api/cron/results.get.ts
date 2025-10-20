import { and, eq, gte, lte, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();

  const leagues = await db
    .select()
    .from(tables.leagues)
    .where(eq(tables.leagues.isActive, 1))
    .all();

  for (const league of leagues) {
    const schedules = await db
      .select()
      .from(tables.schedules)
      .where(eq(tables.schedules.leagueId, league.id))
      .all();

    for (const game of schedules) {
      const matchExists = await db
        .select({ id: tables.matchResults.id })
        .from(tables.matchResults)
        .where(eq(tables.matchResults.id, game.id))
        .get();

      if (matchExists) continue;

      const gameTimestamp = new Date(game.gameTime).getTime();
      const windowStart = gameTimestamp - 1500000; // -25 mins
      const windowEnd = gameTimestamp + 1500000;   // +25 mins
      
      const potentialMatches = await db
        .select()
        .from(tables.eaClubs)
        .where(and(
          gte(tables.eaClubs.timestamp, windowStart),
          lte(tables.eaClubs.timestamp, windowEnd),
          or(
            and(
              eq(tables.eaClubs.clubId, game.homeId),
              eq(tables.eaClubs.opponentClubId, game.awayId)
            ),
            and(
              eq(tables.eaClubs.clubId, game.awayId),
              eq(tables.eaClubs.opponentClubId, game.homeId)
            )
          )
        ))
        .all();

      if (!potentialMatches.length) continue;

      // pick the closest match by timestamp
      const closestMatch = potentialMatches.reduce((a, b) => {
        return Math.abs(a.timestamp - gameTimestamp) < Math.abs(b.timestamp - gameTimestamp) ? a : b;
      });

      // insert into matchResults
      await db.insert(tables.matchResults).values({
        id: game.id,
        matchId: closestMatch.matchId,
        leagueId: league.id,
        seasonId: game.seasonId,
        isCustom: 0,
        timestamp: new Date(closestMatch.timestamp).toISOString(),
        clubId: closestMatch.clubId,
        opponentClubId: closestMatch.opponentClubId,
        garaw: closestMatch.garaw,
        gfraw: closestMatch.gfraw,
        memberString: closestMatch.memberString,
        score: closestMatch.score,
        opponentScore: closestMatch.opponentScore,
        teamSide: closestMatch.teamSide,
        toa: closestMatch.toa,
        winnerByDnf: closestMatch.winnerByDnf,
        winnerByGoalieDnf: closestMatch.winnerByGoalieDnf,
        goals: closestMatch.goals,
        goalsAgainst: closestMatch.goalsAgainst,
        gameId: game.id,
        ogMatchId: closestMatch.matchId,
        userId: game.userId,
        ot: 0 // not available in EA data
      });

      // insert players into playerResults
      const players = await db
        .select()
        .from(tables.eaPlayers)
        .where(eq(tables.eaPlayers.matchId, closestMatch.matchId))
        .all();

        for (const p of players) {
        await db.insert(tables.playerResults).values({
            id: `${game.id}${p.playerId}`,
            matchId: p.matchId,
            leagueId: league.id,
            seasonId: game.seasonId,
            gameId: game.id,
            clubId: p.clubId,
            opponentClubId: p.opponentClubId,
            teamId: p.teamId,
            opponentTeamId: p.opponentTeamId,
            teamArtAbbr: p.teamArtAbbr,
            opponentTeamArtAbbr: p.opponentTeamArtAbbr,
            teamSide: p.teamSide,
            playerId: p.playerId,
            playername: p.playername,
            position: p.position,
            posSorted: p.posSorted,
            isGuest: p.isGuest,
            player_dnf: p.player_dnf,
            removedReason: p.removedReason,
            clientPlatform: p.clientPlatform,
            class: p.class,
            playerLevel: p.playerLevel,
            rankpoints: p.rankpoints,
            ranktierassetid: p.ranktierassetid,
            pNhlOnlineGameType: p.pNhlOnlineGameType,
            score: p.score,
            scoreRaw: p.scoreRaw,
            scoreString: p.scoreString,
            result: p.result,
            opponentScore: p.opponentScore,
            ratingDefense: p.ratingDefense,
            ratingOffense: p.ratingOffense,
            ratingTeamplay: p.ratingTeamplay,
            skgoals: p.skgoals,
            skassists: p.skassists,
            skshots: p.skshots,
            skshotattempts: p.skshotattempts,
            skshotonnetpct: p.skshotonnetpct,
            skshotpct: p.skshotpct,
            skgiveaways: p.skgiveaways,
            sktakeaways: p.sktakeaways,
            skinterceptions: p.skinterceptions,
            skhits: p.skhits,
            skbs: p.skbs,
            skdeflections: p.skdeflections,
            skpassattempts: p.skpassattempts,
            skpasses: p.skpasses,
            skpasspct: p.skpasspct,
            skfol: p.skfol,
            skfow: p.skfow,
            skfopct: p.skfopct,
            skpkclearzone: p.skpkclearzone,
            skplusmin: p.skplusmin,
            skpim: p.skpim,
            skpenaltiesdrawn: p.skpenaltiesdrawn,
            skpossession: p.skpossession,
            skppg: p.skppg,
            skshg: p.skshg,
            sksaucerpasses: p.sksaucerpasses,
            skgwg: p.skgwg,
            glshots: p.glshots,
            glsaves: p.glsaves,
            glsavepct: p.glsavepct,
            glga: p.glga,
            glgaa: p.glgaa,
            gldsaves: p.gldsaves,
            glpokechecks: p.glpokechecks,
            glpkclearzone: p.glpkclearzone,
            glbrkshots: p.glbrkshots,
            glbrksaves: p.glbrksaves,
            glbrksavepct: p.glbrksavepct,
            glpensaves: p.glpensaves,
            glpenshots: p.glpenshots,
            glpensavepct: p.glpensavepct,
            glsoperiods: p.glsoperiods,
            toi: p.toi,
            toiseconds: p.toiseconds,
            memberString: p.memberString,
            playerClass: p.class,
            playerDnf: p.player_dnf
        }).run();
        }

    }
  }
});
