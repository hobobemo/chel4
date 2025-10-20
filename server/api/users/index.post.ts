import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  try {
    const exists = await db.select().from(tables.users).where(eq(tables.users.id, body.id)).get();

    const payload = {
      id: body.id,
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
      guilds: JSON.stringify(body.guilds),
      customerId: body.customerId
    };

    if (exists) {
      await db.update(tables.users).set(payload).where(eq(tables.users.id, body.id));
    } else {
      await db.insert(tables.users).values(payload);
    }

    return { success: true };
  } catch (e: any) {
    console.error('Upsert error:', e.message);
    throw createError({ statusCode: 500, message: 'Database insert/update failed' });
  }
});
