import { createContext, useState, useEffect } from "react"
import API from "../api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (token) {
      setUser({ token }) // simple version for now
    }
  }, [])

  const login = async (email, password) => {
    const res = await API.post("users/login/", {
      email,
      password
    })

    localStorage.setItem("access", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)

    setUser({ token: res.data.access })
  }

  const register = async (data) => {
    await API.post("users/register/", data)
  }

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
