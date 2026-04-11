import { useState } from "react"
import API from "../api"
import { Eye, EyeOff } from "lucide-react"

function ChangePasswordModal({ onClose }) {
  const isMobile = window.innerWidth < 640
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await API.post("users/change-password/", {
        old_password: form.old_password,
        new_password: form.new_password
      })

      setSuccess("Password updated successfully")

      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (err) {
      setError(err?.response?.data?.error || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay(isMobile)}>
      <div style={container(isMobile)}>

        <h2 style={{ marginBottom: "10px" }}>Change Password</h2>

        {error && <div style={errorBox}>{error}</div>}
        {success && <div style={successBox}>{success}</div>}

        <form onSubmit={handleSubmit}>

          <PasswordField
            label="Current Password"
            value={form.old_password}
            onChange={(v) => handleChange("old_password", v)}
            show={show.old}
            toggle={() => setShow(s => ({ ...s, old: !s.old }))}
          />

          <PasswordField
            label="New Password"
            value={form.new_password}
            onChange={(v) => handleChange("new_password", v)}
            show={show.new}
            toggle={() => setShow(s => ({ ...s, new: !s.new }))}
          />

          <PasswordField
            label="Confirm Password"
            value={form.confirm_password}
            onChange={(v) => handleChange("confirm_password", v)}
            show={show.confirm}
            toggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
          />

          <div style={actions(isMobile)}>
            <button type="button" style={cancelBtn} onClick={onClose}>
              Cancel
            </button>

            <button type="submit" style={saveBtn} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
function PasswordField({ label, value, onChange, show, toggle }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ fontSize: "13px" }}>{label}</label>

      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={input}
        />

        <span style={eyeIcon} onClick={toggle}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </span>
      </div>
    </div>
  )
}
export default ChangePasswordModal

const overlay = (isMobile) => ({
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.55)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: isMobile ? "flex-end" : "center",
  justifyContent: "center",
  zIndex: 5000
})

const container = (isMobile) => ({
  width: "100%",
  maxWidth: "420px",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(20px)",
  borderRadius: isMobile ? "16px 16px 0 0" : "16px",
  padding: isMobile ? "18px" : "22px",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  position: isMobile ? "absolute" : "relative",
  bottom: isMobile ? 0 : "auto"
})
const input = {
  width: "100%",
  padding: "12px 42px 12px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#ffffff",
  fontSize: "14px",
  outline: "none",
  color: "#020202",
  transition: "all 0.2s ease",
  boxSizing: "border-box" // ✅ FIX
}

const eyeIcon = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  opacity: 0.6
}

const actions = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "10px",
  marginTop: "18px"
})
const cancelBtn = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  color: "#dc2626",
  border: "1px solid rgba(15,23,42,0.15)",
  background: "rgba(255,255,255,0.7)",
  fontWeight: "500",
  cursor: "pointer"
}

const saveBtn = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 8px 20px rgba(34,197,94,0.3)"
}

const errorBox = {
  background: "rgba(239,68,68,0.1)",
  color: "#b91c1c",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "12px",
  fontSize: "13px"
}

const successBox = {
  background: "rgba(34,197,94,0.1)",
  color: "#065f46",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "12px",
  fontSize: "13px"
}