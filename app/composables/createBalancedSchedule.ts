export function generateBalancedSchedule({leagueId, seasonId, userId, gameType, teams, matchTimes, gameDays, seasonStart, seasonEnd}) {

  const matchups: { homeId: number; awayId: number }[] = []
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matchups.push({ homeId: teams[i], awayId: teams[j] })
    }
  }

  const shuffledMatchups = shuffleArray([...matchups])
  const validDates = getGameDates(seasonStart, seasonEnd, gameDays)
  if (!validDates.length) {
    console.warn('No valid game dates.')
    return []
  }

  const schedule: any[] = []
  const gamesPerSlot = Math.floor(teams.length / 2)
  let matchupIndex = 0

  for (const date of validDates) {
    for (const time of matchTimes) {
      for (let g = 0; g < gamesPerSlot; g++) {
        if (matchupIndex >= shuffledMatchups.length) matchupIndex = 0

        const { homeId, awayId } = shuffledMatchups[matchupIndex]
        const swap = Math.random() > 0.5
        const home = swap ? awayId : homeId
        const away = swap ? homeId : awayId

        const [hour, minute] = time.split(':').map(Number)
        const gameDate = new Date(date)
        gameDate.setHours(hour, minute, 0, 0)

        const push = {
                    leagueId,
          seasonId,
          homeId: home,
          awayId: away,
          gameTime: gameDate.getTime(),
          gameType,
          userId,
        }

        schedule.push({
          leagueId,
          seasonId,
          homeId: home,
          awayId: away,
          gameTime: gameDate.getTime(),
          gameType,
          userId,
        })

        matchupIndex++
      }
    }
  }

  return shuffleArray(schedule)
}
