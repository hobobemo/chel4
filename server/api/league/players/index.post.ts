export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  if (!body.id) {
    return createError({ statusCode: 400, message: 'Missing id in body' });
  }

  try {
    await db.insert(tables.playerResults).values(body).run();
    return { success: true };
  } catch (e: any) {
    console.error('Insert error:', e.message, e.stack);
    throw createError({ statusCode: 500, message: 'Database insert failed' });
  }
});
