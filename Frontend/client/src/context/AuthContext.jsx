import { createContext, useState, useEffect } from "react"
import API from "../api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const access = localStorage.getItem("access")
      const savedUser = localStorage.getItem("user")

      // 1. Fast restore (instant UI)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }

      // 2. No token → done
      if (!access) {
        setLoading(false)
        return
      }

      // 3. Validate with backend (silent refresh handled by interceptor)
      try {
        const res = await API.get("users/me/")
        setUser(res.data)
        localStorage.setItem("user", JSON.stringify(res.data))
      } catch (err) {
        console.warn("Auth validation failed")

        // ONLY logout if refresh also failed
        const stillHasToken = localStorage.getItem("access")

        if (!stillHasToken) {
          localStorage.removeItem("user")
          setUser(null)
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])
  
  const register = async (data) => {
    try {
      const res = await API.post("users/register/", data)
      return res
    } catch (error) {
      // Let UI handle messaging
      throw error
    }
  }


  /* ================= LOGIN ================= */

  const login = async (email, password) => {
    const res = await API.post("users/login/", { email, password })

    localStorage.setItem("access", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)
    localStorage.setItem("user", JSON.stringify(res.data.user))

    setUser(res.data.user)
  }

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}