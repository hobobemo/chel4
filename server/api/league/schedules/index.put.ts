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
      .update(tables.schedules)
      .set({
        seasonId: body.seasonId,
        homeId: body.homeId,
        awayId: body.awayId,
        gameTime: body.gameTime,
        gameType: body.gameType,
        userId: body.userId
      })
      .where(and(
        eq(tables.schedules.id, body.id),
        eq(tables.schedules.leagueId, body.leagueId)
      ));

    return { success: true };
  } catch (e: any) {
    console.error('Update error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database update failed' });
  }
});
