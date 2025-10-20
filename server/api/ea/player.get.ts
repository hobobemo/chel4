export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = query.name as string

  if (!name) {
    throw createError({ statusCode: 400, message: 'Missing member name' })
  }

  try {
    const response = await $fetch(`https://proclubs.ea.com/api/nhl/members/search`, {
      params: {
        platform: 'common-gen5',
        memberName: name
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    })

    if (!response || typeof response !== 'object') {
      console.warn('[EA API] Empty or invalid response for', name)
      return []
    }

    const clubs = Object.values(response)
    return clubs
  } catch (err: any) {
    console.error('[EA API] Fetch failed:', err.message)
    // Return a safe fallback instead of throwing
    return []
  }
})
