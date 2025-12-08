import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = { user, token, login, logout, isAuthenticated: !!user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
