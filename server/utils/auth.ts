import { eq, and } from 'drizzle-orm';

export async function useAuth(token: String) {
    const db = useDrizzle();   
    const license = await db
        .select()
        .from(tables.licenses)
        .where(and(eq(tables.licenses.publicKey, token), eq(tables.licenses.isActive, 1)))
        .get();

    if (!license) {
        return false;
    }

    return license.id;
}
