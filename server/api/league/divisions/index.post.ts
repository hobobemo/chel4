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
    const [response] = await db.insert(tables.divisions).values({
      name: body.name,
      userId: body.userId,
      isActive: body.isActive ?? 1,
      discordId: body.discordId,
      leagueId: body.leagueId,
      logo: body.logo
    }).returning({ id: tables.divisions.id });

    return { success: true, id: response.id };
  } catch (e: any) {
    console.error('Insert error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database insert failed' });
  }
});
