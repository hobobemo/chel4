export default eventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  const authHeader = getHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Invalid or missing token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const license = await useAuth(token);
  if (!license) {
    throw createError({ statusCode: 401, message: "Invalid or inactive license" });
  }

  if (!Array.isArray(body.schedule) || body.schedule.length === 0) {
    throw createError({ statusCode: 400, message: "Missing or invalid schedule array" });
  }

  // 🧹 Strip id, convert values to correct types
  const records = body.schedule.map(({ id, ...game }) => ({
    leagueId: Number(game.leagueId),
    seasonId: Number(game.seasonId),
    homeId: Number(game.homeId),
    awayId: Number(game.awayId),
    gameTime: Number(game.gameTime),
    gameType: Number(game.gameType),
    userId: String(game.userId),
  }));

  try {
    // 🚀 Batch insert in chunks (keep param count low)
    const batchSize = 20;
    for (let i = 0; i < records.length; i += batchSize) {
      const chunk = records.slice(i, i + batchSize);
      await db.insert(tables.schedules).values(chunk);
    }

    return {
      success: true,
      count: records.length,
      message: `✅ Inserted ${records.length} schedule records successfully.`,
    };
  } catch (e: any) {
    console.error("❌ Insert error:", e.message);
    throw createError({ statusCode: 500, message: "Database insert failed" });
  }
});
