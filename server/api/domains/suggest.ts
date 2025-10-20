export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const domain = query.domain as string

  if (!domain) {
    throw createError({
      statusCode: 400,
      message: 'Missing domain query parameter'
    })
  }

  const res = await fetch(`${config.public.apiUrl}/v1/domains/suggest?query=${domain}&waitMs=1000`, {
    method: 'GET',
    headers: {
      Authorization: `sso-key ${config.apiKey}:${config.apiSecret}`,
      Accept: 'application/json'
    }
  })

  const data = await res.json()

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: data.message || 'GoDaddy API error',
      data
    })
  }

  return data
})
