import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async () => {
  const db = useDrizzle();

  const leagues = await db
    .select()
    .from(tables.leagues)
    .where(eq(tables.leagues.isActive, 1))
    .all();

  for (const league of leagues) {
    const teams = await db
      .select()
      .from(tables.teams)
      .where(and(
        eq(tables.teams.leagueId, league.id),
        eq(tables.teams.isActive, 1)
      ))
      .all();

    for (const team of teams) {
      if (!team.clubId) continue;

      try {
        const matches = await $fetch(`https://proclubs.ea.com/api/nhl/clubs/matches?clubIds=${team.clubId}&platform=common-gen5&matchType=club_private`);

        if (Array.isArray(matches)) {
          for (const match of matches) {
            const matchId = match.matchId;
            const timestamp = Number(match.timestamp);

            // 🟦 INSERT CLUB STATS
            for (const [clubIdStr, club] of Object.entries(match.clubs || {})) {
              const clubId = parseInt(clubIdStr);
              const eaClubId = `${matchId}${clubId}`; // 🧠 no hashing

              const details = club.details ?? {};
              const kit = details.customKit ?? {};

              try {
                await db.insert(tables.eaClubs).values({
                  id: eaClubId,
                  matchId,
                  timestamp,
                  clubId,
                  score: Number(club.score),
                  scoreString: club.scoreString,
                  goals: Number(club.goals),
                  goalsAgainst: Number(club.goalsAgainst),
                  result: club.result,
                  shots: Number(club.shots),
                  passa: Number(club.passa),
                  passc: Number(club.passc),
                  ppg: Number(club.ppg),
                  ppo: Number(club.ppo),
                  toa: Number(club.toa),
                  garaw: Number(club.garaw),
                  gfraw: Number(club.gfraw),
                  winnerByDnf: Number(club.winnerByDnf),
                  winnerByGoalieDnf: Number(club.winnerByGoalieDnf),
                  clubDivision: Number(club.clubDivision),
                  cNhlOnlineGameType: club.cNhlOnlineGameType,
                  teamSide: Number(club.teamSide),
                  memberString: club.memberString,
                  opponentClubId: Number(club.opponentClubId),
                  opponentScore: Number(club.opponentScore),
                  opponentTeamArtAbbr: club.opponentTeamArtAbbr,
                  teamArtAbbr: club.teamArtAbbr,
                  regionId: Number(details.regionId),
                  teamId: Number(details.teamId),
                  detailsName: details.name,
                  customKitIsCustomTeam: Number(kit.isCustomTeam),
                  customKitCrestAssetId: Number(kit.crestAssetId),
                  customKitUseBaseAsset: Number(kit.useBaseAsset)
                }).run();
              } catch (e) {
                if (!e.message?.includes('UNIQUE')) console.error('eaClub insert error:', e.message);
              }
            }

            // 🟨 INSERT PLAYER STATS
            for (const [clubIdStr, players] of Object.entries(match.players || {})) {
              for (const [playerId, p] of Object.entries(players)) {
                const eaPlayerId = `${matchId}${playerId}`; // 🧠 no hashing

                try {
                  await db.insert(tables.eaPlayers).values({
                    id: eaPlayerId,
                    matchId,
                    clubId: Number(clubIdStr),
                    opponentClubId: Number(p.opponentClubId),
                    teamId: Number(p.teamId),
                    opponentTeamId: Number(p.opponentTeamId),
                    teamArtAbbr: p.teamArtAbbr,
                    opponentTeamArtAbbr: p.opponentTeamArtAbbr,
                    teamSide: Number(p.teamSide),
                    playerId,
                    playername: p.playername,
                    position: p.position,
                    posSorted: Number(p.posSorted),
                    isGuest: Number(p.isGuest),
                    player_dnf: Number(p.player_dnf),
                    removedReason: p.removedReason,
                    clientPlatform: p.clientPlatform,
                    class: p.class,
                    playerLevel: Number(p.playerLevel),
                    rankpoints: Number(p.rankpoints),
                    ranktierassetid: p.ranktierassetid,
                    pNhlOnlineGameType: p.pNhlOnlineGameType,
                    score: Number(p.score),
                    scoreRaw: Number(p.scoreRaw),
                    scoreString: p.scoreString,
                    result: p.result,
                    opponentScore: Number(p.opponentScore),
                    ratingDefense: p.ratingDefense,
                    ratingOffense: p.ratingOffense,
                    ratingTeamplay: p.ratingTeamplay,
                    skgoals: Number(p.skgoals),
                    skassists: Number(p.skassists),
                    skshots: Number(p.skshots),
                    skshotattempts: Number(p.skshotattempts),
                    skshotonnetpct: p.skshotonnetpct,
                    skshotpct: p.skshotpct,
                    skgiveaways: Number(p.skgiveaways),
                    sktakeaways: Number(p.sktakeaways),
                    skinterceptions: Number(p.skinterceptions),
                    skhits: Number(p.skhits),
                    skbs: Number(p.skbs),
                    skdeflections: Number(p.skdeflections),
                    skpassattempts: Number(p.skpassattempts),
                    skpasses: Number(p.skpasses),
                    skpasspct: p.skpasspct,
                    skfol: Number(p.skfol),
                    skfow: Number(p.skfow),
                    skfopct: p.skfopct,
                    skpkclearzone: Number(p.skpkclearzone),
                    skplusmin: Number(p.skplusmin),
                    skpim: Number(p.skpim),
                    skpenaltiesdrawn: Number(p.skpenaltiesdrawn),
                    skpossession: Number(p.skpossession),
                    skppg: Number(p.skppg),
                    skshg: Number(p.skshg),
                    sksaucerpasses: Number(p.sksaucerpasses),
                    skgwg: Number(p.skgwg),
                    glshots: Number(p.glshots),
                    glsaves: Number(p.glsaves),
                    glsavepct: p.glsavepct,
                    glga: Number(p.glga),
                    glgaa: p.glgaa,
                    gldsaves: Number(p.gldsaves),
                    glpokechecks: Number(p.glpokechecks),
                    glpkclearzone: Number(p.glpkclearzone),
                    glbrkshots: Number(p.glbrkshots),
                    glbrksaves: Number(p.glbrksaves),
                    glbrksavepct: p.glbrksavepct,
                    glpensaves: Number(p.glpensaves),
                    glpenshots: Number(p.glpenshots),
                    glpensavepct: p.glpensavepct,
                    glsoperiods: Number(p.glsoperiods),
                    toi: p.toi,
                    toiseconds: Number(p.toiseconds),
                    memberString: p.memberString
                  }).run();
                } catch (e) {
                  if (!e.message?.includes('UNIQUE')) console.error('eaPlayer insert error:', e.message);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(`EA fetch failed for clubId ${team.clubId}:`, err.message);
      }

      await new Promise((res) => setTimeout(res, 300));
    }
  }

  return { success: true };
});
