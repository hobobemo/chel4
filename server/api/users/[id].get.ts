import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');

  const result = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, id))
    .get();

  return result ?? createError({ statusCode: 404, message: 'User not found' });
});
