export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = query.name as string

  if (!name) {
    throw createError({ statusCode: 400, message: 'Missing club name' })
  }

  try {
    const response = await $fetch('https://proclubs.ea.com/api/nhl/clubs/search', {
      params: {
        platform: 'common-gen5',
        clubName: name
      },
      headers: {
        // helps avoid Cloudflare being blocked by EA
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    })

    if (!response || typeof response !== 'object') {
      console.warn('[EA API] Empty or invalid response for club search:', name)
      return []
    }

    // EA returns an object keyed by clubId
    const clubs = Object.values(response)
    return clubs
  } catch (err: any) {
    console.error('[EA API] Club search failed:', err.message)
    // Return empty array instead of throwing to keep SSR stable
    return []
  }
})
