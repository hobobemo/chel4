export default defineEventHandler(async (event) => {
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
    const [response] = await db.insert(tables.leagues).values({
      name: body.name,
      seasons: body.seasons,
      divisions: body.divisions,
      guildId: body.guildId,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      isActive: body.isActive,
      licenseId: license
    }).returning({ id: tables.leagues.id });

    return { success: true, id: response.id };
  } catch (e: any) {
    console.error('Insert error:', e.message, e.stack);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database insert failed',
      message: e.message
    });
  }
});
