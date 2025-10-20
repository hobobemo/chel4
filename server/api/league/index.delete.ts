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
      .delete(tables.leagues)
      .where(and(
        eq(tables.leagues.id, body.id),
        eq(tables.leagues.licenseId, license)
      ));

    return { success: true };
  } catch (e: any) {
    console.error('Delete error:', e.message, e.stack);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database delete failed',
      message: e.message
    });
  }
});
