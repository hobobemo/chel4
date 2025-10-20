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
    const [newSchedule] = await db.insert(tables.schedules)
      .values({
        leagueId: body.leagueId,
        seasonId: body.seasonId,
        homeId: body.homeId,
        awayId: body.awayId,
        gameTime: body.gameTime,
        gameType: body.gameType,
        userId: body.userId
      })
      .returning({ id: tables.schedules.id });

    return { success: true, id: newSchedule.id };
  } catch (e: any) {
    console.error('Insert error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database insert failed' });
  }
});
