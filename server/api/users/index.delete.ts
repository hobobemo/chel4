import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  if (!body.id) throw createError({ statusCode: 400, message: 'Missing user ID' });

  await db.delete(tables.users).where(eq(tables.users.id, body.id));
  return { success: true };
});
