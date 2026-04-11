import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../api"

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 10000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showMessage("error", "Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await API.post(`users/password-reset-confirm/${token}/`, {
        password
      })

      showMessage("success", "Password reset successful. You can now log in.")
      setTimeout(() => navigate("/"), 1500)

    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.error ||
        err.response?.data?.password?.[0] ||
        "Reset failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Reset Your Password</h2>

        {message && (
          <div style={messageBox(message.type)}>
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} style={closeBtn}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={form}>

          {/* NEW PASSWORD */}
          <div style={passwordWrapper}>
            <input
            onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...input, paddingRight: "45px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButton}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={passwordWrapper}>
            <input
              onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ ...input, paddingRight: "45px" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={eyeButton}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={button}
          onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-2px)"
  e.currentTarget.style.boxShadow = "0 15px 35px rgba(34,197,94,0.4)"
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.3)"
}}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ================= SVG ICONS ================= */

function EyeIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
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

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",

  background: `
    radial-gradient(600px at 20% 30%, rgba(34,197,94,0.12), transparent 70%),
    radial-gradient(600px at 80% 20%, rgba(16,185,129,0.1), transparent 70%),
    linear-gradient(180deg, #ecfdf5, #f0fdfa)
  `
}

const card = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(18px)",

  padding: "28px",
  borderRadius: "18px",

  width: "100%",
  maxWidth: "360px",

  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",

  color: "#1f2937"
}
const title = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "700",
  color: "#065f46",
  marginBottom: "10px"
}

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginTop: "20px"
}

const input = {
  padding: "12px",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "10px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",

  background: "#ffffff",
  color: "#000000",

  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease"
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

const button = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",

  boxShadow: "0 10px 25px rgba(34,197,94,0.3)",
  transition: "all 0.2s ease"
}

const messageBox = (type) => ({
  background: type === "error"
    ? "rgba(239,68,68,0.1)"
    : "rgba(34,197,94,0.1)",

  color: type === "error" ? "#b91c1c" : "#065f46",

  padding: "10px 14px",
  borderRadius: "8px",
  marginTop: "15px",
  marginBottom: "10px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  fontSize: "14px"
})

const closeBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
}

export default ResetPassword