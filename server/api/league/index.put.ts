import { eq, and } from 'drizzle-orm';

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
    await db
      .update(tables.leagues)
      .set({
        name: body.name,
        seasons: body.seasons,
        divisions: body.divisions,
        guildId: body.guildId,
        primaryColor: body.primaryColor,
        secondaryColor: body.secondaryColor,
        isActive: body.isActive,
        licenseId: license
      })
      .where(and(
        eq(tables.leagues.id, body.id),
        eq(tables.leagues.licenseId, license)
      ));

    return { success: true };
  } catch (e: any) {
    console.error('Update error:', e.message, e.stack);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database update failed',
      message: e.message
    });
  }
});
