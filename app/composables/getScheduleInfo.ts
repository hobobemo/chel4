import { fromDate, CalendarDate } from '@internationalized/date'

export function timestampToCalendarDate(ts: number | string | null | undefined): CalendarDate | null {
  const num = Number(ts)
  if (!num || isNaN(num)) return null

  const jsDate = new Date(num)
  if (isNaN(jsDate.getTime())) return null

  return fromDate(jsDate)
}

export function calendarDateToTimestamp(cd: CalendarDate | null): number | null {
  if (!cd) return null
  const d = cd.toDate?.() ?? new Date(cd.year, cd.month - 1, cd.day)
  return d.getTime()
}

export function shuffleArray(array: any[]): any[] {
  return array.sort(() => Math.random() - 0.5);
}

export function formatTimestamp(ts: number | string | null | undefined): string {
  if (!ts) return ''

  let num = Number(ts)
  if (isNaN(num)) return ''

  // Detect if timestamp is in seconds, convert to milliseconds
  if (num < 1e12) {
    num *= 1000
  }

  const date = new Date(num)
  if (isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function toTimestamp(dateObj: { year: number; month: number; day: number } | null) {
  if (!dateObj) return null;
  return new Date(dateObj.year, dateObj.month - 1, dateObj.day).getTime();
}

export function formatCalendarDate(cd: CalendarDate | null) {
  if (!cd) return ''
  try {
    return cd.toDate().toLocaleDateString()
  } catch {
    return ''
  }
}

export function getWeekCount(start: number, end: number): number {
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000
  return Math.ceil((end - start) / millisecondsPerWeek)
}

export function getGameDates(seasonStart: number | string, seasonEnd: number | string, gameDays: string[]): Date[] {
  if (!seasonStart || !seasonEnd || !gameDays || !gameDays.length) {
    console.warn('⚠️ getGameDates called with invalid or empty parameters:', { seasonStart, seasonEnd, gameDays })
    return []
  }

  const validDates: Date[] = []
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const allowedDays = gameDays.map(day => dayMap[day]).filter(v => v !== undefined)

  const start = new Date(Number(seasonStart))
  const end = new Date(Number(seasonEnd))
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  console.log('Season range:', start, '→', end)
  console.log('Allowed days:', allowedDays)

  let current = new Date(start)
  while (current <= end) {
    if (allowedDays.includes(current.getDay())) {
      validDates.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return validDates
}

export function useScheduleGenerator(
  season: Record<string, any>,
  teams: string[] = [],
  gameTimes: string[] = [],
  gameDays: string[] = []
) {
  if (!season || !teams.length || !gameTimes.length || !gameDays.length) {
    console.warn('Missing required input.');
    return [];
  }

  if (teams.length < 2 || teams.length % 2 !== 0) {
    console.warn('Team count must be even and >= 2 to schedule matches properly.');
    return [];
  }

  const matchups = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matchups.push({ homeTeam: teams[i], awayTeam: teams[j] });
    }
  }

  const totalGamesNeeded = matchups.length;
  let scheduledGames = [];
  while (scheduledGames.length < totalGamesNeeded * 2) {
    scheduledGames = scheduledGames.concat(shuffleArray([...matchups]));
  }

  const validDates = getGameDates(season.seasonStart, season.seasonEnd, gameDays);
  const schedule = [];
  let gameIndex = 0;
  const gamesPerSlot = teams.length / 2;

  for (const date of validDates) {
    for (const time of gameTimes) {
      for (let g = 0; g < gamesPerSlot; g++) {
        if (gameIndex >= scheduledGames.length) break;

        const { homeTeam, awayTeam } = scheduledGames[gameIndex];

        const hours = parseInt(time.slice(0, 2), 10);
        const minutes = parseInt(time.slice(2, 4), 10);

        const gameDate = new Date(date);
        gameDate.setHours(hours, minutes, 0, 0);

        schedule.push({
          seasonId: season.id,
          timestamp: gameDate.getTime(),
          homeTeam,
          awayTeam,
        });

        gameIndex++;
      }
    }
  }

  return schedule;
}

export function daysOfTheWeek(){
  return [
    { id: 'Sun', label: 'Sunday' },
    { id: 'Mon', label: 'Monday' },
    { id: 'Tue', label: 'Tuesday' },
    { id: 'Wed', label: 'Wednesday' },
    { id: 'Thu', label: 'Thursday' },
    { id: 'Fri', label: 'Friday' },
    { id: 'Sat', label: 'Saturday' }
  ];
}

export function gameTypes(){
  return [
    { id: 0, label: 'Exhibition' },
    { id: 1, label: 'Preseason' },
    { id: 2, label: 'Regular Season' },
    { id: 3, label: 'Playoffs' },
  ];
}

export function timeOptions() {
  const times: string[] = []
  for (let h = 0; h < 24; h++) { // 0 → 11
    for (let m = 0; m < 60; m += 15) {
      const hour = String(h).padStart(2, '0')
      const minute = String(m).padStart(2, '0')
      times.push(`${hour}:${minute}`)
    }
  }
  return times
}