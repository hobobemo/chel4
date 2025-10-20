import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

// Functions
export type Awardee = typeof schema.awardees.$inferSelect
export type Division = typeof schema.divisions.$inferSelect
export type League = typeof schema.leagues.$inferSelect
export type License = typeof schema.licenses.$inferSelect
export type Match = typeof schema.matchResults.$inferSelect
export type Player = typeof schema.playerResults.$inferSelect
export type Schedule = typeof schema.schedules.$inferSelect
export type Season = typeof schema.seasons.$inferSelect
export type Team = typeof schema.teams.$inferSelect
export type Trophy = typeof schema.trophies.$inferSelect
export type Users = typeof schema.users.$inferSelect

// EA
export type RawClub = typeof schema.eaClubs.$inferSelect
export type RawPlayer = typeof schema.eaPlayers.$inferSelect