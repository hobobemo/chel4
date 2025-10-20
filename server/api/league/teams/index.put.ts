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
      .update(tables.teams)
      .set({
        clubId: body.clubId,
        name: body.name,
        eaName: body.eaName,
        abbr: body.abbr,
        logo: body.logo,
        isActive: body.isActive,
        userId: body.userId,
        divisionId: body.divisionId,
        logoType: body.logoType,
        useBaseAsset: body.useBaseAsset,
        crestAssetId: body.crestAssetId,
        isCustomTeam: body.isCustomTeam,
        playerRole: body.playerRole,
        gmRole: body.gmRole,
        agmRole: body.agmRole
      })
      .where(and(
        eq(tables.teams.id, body.id),
        eq(tables.teams.leagueId, body.leagueId)
      ));

    return { success: true };
  } catch (e: any) {
    console.error('Update error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database update failed' });
  }
});
