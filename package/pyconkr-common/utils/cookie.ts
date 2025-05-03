import * as R from 'remeda'

export const getCookie = (name: string) => {
  if (!R.isString(document.cookie) || R.isEmpty(document.cookie))
    return undefined

  let cookieValue: string | undefined
  document.cookie.split(';').forEach((cookie) => {
    if (R.isEmpty(cookie) || !cookie.includes('=')) return
    const [key, value] = cookie.split('=', 2)
    if (key.trim() === name) cookieValue = decodeURIComponent(value) as string
  })
  return cookieValue
}
