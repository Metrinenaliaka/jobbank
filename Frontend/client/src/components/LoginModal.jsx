import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"
import API from "../api"

function LoginModal({ onClose }) {
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      await login(email, password)
      
      toast.success("Login successful")
      onClose()
    } catch (err) {
      toast.error("Invalid credentials or email not verified")
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()

    try {
      // 🔥 CHANGE THIS ENDPOINT TO MATCH YOUR BACKEND
      await API.post("users/password-reset/", {
        email: resetEmail
      })

      toast.success("Password reset link sent to your email.")
      setShowForgot(false)
    } catch (err) {
      toast.error("Error sending reset email.")
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        {!showForgot ? (
          <>
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

              <div style={forgotContainer}>
                <span
                  style={forgotLink}
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </span>
              </div>

              <button style={primaryBtn} type="submit">
                Log In
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={title}>Reset Password</h2>
            <p style={subtitle}>Enter your email to receive reset link</p>

            <form onSubmit={handlePasswordReset} style={formStyle}>
              <input
                style={input}
                placeholder="Email"
                onChange={e => setResetEmail(e.target.value)}
                required
              />

              <button style={primaryBtn} type="submit">
                Send Reset Link
              </button>
            </form>

            <div style={forgotContainer}>
              <span
                style={forgotLink}
                onClick={() => setShowForgot(false)}
              >
                Back to Login
              </span>
            </div>
          </>
        )}

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

const forgotContainer = {
  textAlign: "right",
  fontSize: "13px"
}

const forgotLink = {
  color: "#2ecc71",
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