
let cachedSessionId = null

export const getSessionId = async () => {
  // Jika sudah ada di cache, pakai
  if (cachedSessionId) {
    return cachedSessionId
  }

  // Cek di localStorage (biar gak request terus)
  const savedSession = localStorage.getItem('sessionId')
  if (savedSession) {
    cachedSessionId = savedSession
    return savedSession
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/session`)
    const result = await response.json()
    if (result.status === 'success') {
      const sessionId = result.data.session_id
      cachedSessionId = sessionId
      localStorage.setItem('sessionId', sessionId)
      return sessionId
    }
  } catch (error) {
    console.error('Gagal ambil session:', error)
    // Fallback: buat local session
    const fallbackId = 'S-' + Math.floor(100000 + Math.random() * 900000)
    localStorage.setItem('sessionId', fallbackId)
    return fallbackId
  }
}

export const getSessionNumber = () => {
  const sessionId = cachedSessionId || localStorage.getItem('sessionId') || ''
  return sessionId.replace('S-', '')
}

export const resetSession = () => {
  cachedSessionId = null
  localStorage.removeItem('sessionId')
}