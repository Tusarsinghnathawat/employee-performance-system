import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

const storedAuth = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  return {
    token,
    user: user ? JSON.parse(user) : null,
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = storedAuth()
    if (auth.token) {
      setToken(auth.token)
      setUser(auth.user)
      fetchMe(auth.token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchMe = async (authToken) => {
    try {
      const response = await api.get('/api/auth/me')
      const returnedUser = response.data.user || response.data
      setUser(returnedUser)
      setToken(authToken)
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(returnedUser))
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials)
    const payload = response.data
    const authToken = payload.token || payload.accessToken
    const returnedUser = payload.user || payload
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(returnedUser))
    setToken(authToken)
    setUser(returnedUser)
    return returnedUser
  }

  const register = async (values) => {
    const response = await api.post('/api/auth/register', values)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser: fetchMe,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
