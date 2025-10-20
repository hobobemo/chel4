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
    const [newSeason] = await db.insert(tables.seasons)
      .values({
        leagueId: body.leagueId,
        userId: body.userId,
        isActive: body.isActive,
        name: body.name,
        startDate: JSON.stringify(body.startDate),
        endDate: JSON.stringify(body.endDate),
        registrationStart: JSON.stringify(body.registrationStart),
        registrationEnd: JSON.stringify(body.registrationEnd),
        draftDate: JSON.stringify(body.draftDate),
        discordRole: body.discordRole,
        discordId: body.discordId
      })
      .returning({ id: tables.seasons.id });

    return { success: true, id: newSeason.id };
  } catch (e: any) {
    console.error('Insert error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database insert failed' });
  }
});
