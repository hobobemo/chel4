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

  try {
    const [newTeam] = await db.insert(tables.teams)
      .values({
        clubId: body.clubId,
        leagueId: body.leagueId,
        name: body.name,
        eaName: body.eaName,
        abbr: body.abbr,
        logo: body.logo,
        isActive: body.isActive ?? 1,
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
      .returning({ id: tables.teams.id });

    return { success: true, id: newTeam.id };
  } catch (e: any) {
    console.error('Insert error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database insert failed' });
  }
});
