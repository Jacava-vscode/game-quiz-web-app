/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getProfile, loginUser, signupUser } from '../services/apiClient'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('gq_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const profile = await getProfile(token)
        setUser(profile)
      } catch (error) {
        console.error('Profile fetch failed', error)
        localStorage.removeItem('gq_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [token])

  const login = useCallback(async (credentials) => {
    const { token: authToken, user: userPayload } = await loginUser(credentials)
    localStorage.setItem('gq_token', authToken)
    setToken(authToken)
    setUser(userPayload)
  }, [])

  const signup = useCallback(async (payload) => {
    const { token: authToken, user: userPayload } = await signupUser(payload)
    localStorage.setItem('gq_token', authToken)
    setToken(authToken)
    setUser(userPayload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('gq_token')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    signup,
    logout,
    setUser
  }), [token, user, loading, login, signup, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
