import { createContext, useState, useEffect } from "react"
import toast from "react-hot-toast"
import API from "../api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const access = localStorage.getItem("access")

    if (savedUser && access) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  /* =========================
     REGISTER
  ========================= */

  const register = async (data) => {
    try {
      const res = await API.post("users/register/", data)
      return res
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data)
      throw error
    }
  }

  /* =========================
     LOGIN
  ========================= */

  const login = async (email, password) => {
    try {
      const res = await API.post("users/login/", {
        email,
        password
      })

      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      setUser(res.data.user)

    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
      throw error
    }
  }

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}