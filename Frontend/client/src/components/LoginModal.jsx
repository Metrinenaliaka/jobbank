import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function LoginModal({ onClose }) {

  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await login(email, password)
      alert("Login successful")
      onClose()
    } catch {
      alert("Invalid credentials or email not verified")
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        <h2 style={title}>Welcome Back 👋</h2>
        <p style={subtitle}>Login to continue</p>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            style={input}
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button style={primaryBtn} type="submit">
            Log In
          </button>
        </form>

        <button style={closeBtn} onClick={onClose}>
          Cancel
        </button>

      </div>
    </div>
  )
}

/* ===== Styles ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
}

const modal = {
  background: "white",
  width: "360px",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
}

const title = {
  margin: 0,
  marginBottom: "5px"
}

const subtitle = {
  color: "#666",
  marginBottom: "20px"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const input = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px"
}

const primaryBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
}

const closeBtn = {
  marginTop: "10px",
  width: "100%",
  padding: "10px",
  border: "none",
  background: "#f5f5f5",
  borderRadius: "6px",
  cursor: "pointer"
}

export default LoginModal
