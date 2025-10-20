import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  if (!body.id) throw createError({ statusCode: 400, message: 'Missing user ID' });

  await db.update(tables.users).set({
    username: body.username,
    global_name: body.global_name,
    avatar: body.avatar,
    discriminator: body.discriminator,
    email: body.email,
    verified: body.verified ? 1 : 0,
    locale: body.locale,
    mfa_enabled: body.mfa_enabled ? 1 : 0,
    premium_type: body.premium_type,
    connections: JSON.stringify(body.connections),
    guilds: JSON.stringify(body.guilds)
  }).where(eq(tables.users.id, body.id));

  return { success: true };
});
