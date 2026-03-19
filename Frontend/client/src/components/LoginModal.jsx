import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../api"

function LoginModal({ onClose }) {
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      setMessage("")
    }, 10000)
    return () => clearTimeout(timer)
  }, [message])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await login(email, password)
      setMessageType("success")
      setMessage("Login successful")
      onClose()
    } catch (err) {
      setMessageType("error")
      setMessage("Invalid credentials or email not verified")
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()

    try {
      await API.post("users/password-reset/", {
        email: resetEmail
      })

      setMessageType("success")
      setMessage("Password reset link sent to your email.")
      setShowForgot(false)

    } catch (err) {
      setMessageType("error")
      setMessage("Error sending reset email.")
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        {message && (
          <div
            style={{
              ...messageBox,
              background: messageType === "error" ? "#fdecea" : "#e8f8f0",
              borderColor: messageType === "error" ? "#e74c3c" : "#2ecc71"
            }}
          >
            <span>{message}</span>
            <button onClick={() => setMessage("")} style={closeMessageBtn}>
              ×
            </button>
          </div>
        )}

        {!showForgot ? (
          <>
            <h2 style={title}>Welcome Back</h2>
            <p style={subtitle}>Login to continue</p>

            <form onSubmit={handleLogin} style={formStyle}>
              <input
                style={input}
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                required
              />

              <div style={passwordWrapper}>
                <input
                  style={{ ...input, paddingRight: "45px" }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeButton}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

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

/* ================= SVG ICONS ================= */

function EyeIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.86 21.86 0 0 1 5.06-6.94M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M1 1l22 22" />
    </svg>
  )
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000
}

const modal = {
  background: "white",
  width: "360px",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
}

const messageBox = {
  padding: "10px 14px",
  border: "1px solid",
  borderRadius: "6px",
  marginBottom: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "14px"
}

const closeMessageBtn = {
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  lineHeight: 1
}

const title = { margin: 0, marginBottom: "5px" }
const subtitle = { color: "#666", marginBottom: "20px" }

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const input = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box"   // ✅ ADD THIS
}

const passwordWrapper = {
  position: "relative",
  width: "100%"
}

const eyeButton = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer"
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