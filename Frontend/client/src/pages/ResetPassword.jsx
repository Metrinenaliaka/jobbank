import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../api"

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await API.post(`users/password-reset-confirm/${token}/`, {
        password
      })

      toast.success("Password reset successful. You can now log in.")
      navigate("/") // redirect to homepage or login

    } catch (err) {
      toast.error(
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
        <h2>Reset Your Password</h2>

        <form onSubmit={handleSubmit} style={form}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={input}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={input}
          />

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

/* Simple styling */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f6f9"
}

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  width: "350px"
}

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginTop: "20px"
}

const input = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px"
}

const button = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
}

export default ResetPassword