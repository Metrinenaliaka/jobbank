import { createContext, useState, useEffect } from "react"
import API from "../api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email, password) => {
    const res = await API.post("users/login/", {
      email,
      password
    })

    localStorage.setItem("access", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)
    localStorage.setItem("user", JSON.stringify(res.data.user))

    setUser(res.data.user)
  }

  const register = async (data) => {
    await API.post("users/register/", data)
  }

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
