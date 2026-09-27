import { useCallback, useEffect, useState } from 'react'
import {
  getUser,
  handleAuthCallback,
  login as identityLogin,
  logout as identityLogout,
  onAuthChange,
  signup as identitySignup,
  type User,
} from '@netlify/identity'

export interface AuthUser {
  id: string
  email: string
  pseudonym: string
}

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null
  const metaPseudonym = user.userMetadata?.pseudonym
  const pseudonym =
    typeof metaPseudonym === 'string' && metaPseudonym.trim().length > 0
      ? metaPseudonym
      : (user.email ?? 'Agent')
  return { id: user.id, email: user.email ?? '', pseudonym }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        await handleAuthCallback()
      } catch {
        // malformed or expired callback token — ignore, user stays logged out
      }
      const current = await getUser()
      if (!cancelled) {
        setUser(toAuthUser(current))
        setReady(true)
      }
    }

    init()
    const unsubscribe = onAuthChange((_event, nextUser) => {
      setUser(toAuthUser(nextUser))
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const signup = useCallback(
    async (email: string, password: string, pseudonym: string) => {
      const result = await identitySignup(email, password, { pseudonym })
      const confirmed = Boolean(result.confirmedAt)
      if (confirmed) setUser(toAuthUser(result))
      return { confirmed }
    },
    [],
  )

  const login = useCallback(async (email: string, password: string) => {
    const result = await identityLogin(email, password)
    setUser(toAuthUser(result))
  }, [])

  const logout = useCallback(async () => {
    await identityLogout()
    setUser(null)
  }, [])

  return { user, ready, login, signup, logout }
}
