import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  if (!body.id || !body.matchId) {
    return createError({ statusCode: 400, message: 'Missing id or matchId in body' });
  }

  try {
    await db
      .delete(tables.playerResults)
      .where(and(
        eq(tables.playerResults.id, body.id),
        eq(tables.playerResults.matchId, body.matchId)
      ));

    return { success: true };
  } catch (e: any) {
    console.error('Delete error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database delete failed' });
  }
});
