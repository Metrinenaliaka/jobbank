import { useState, useContext } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { AuthContext } from "../context/AuthContext"

function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register } = useContext(AuthContext)

  const languagesList = [
    "English","French","Spanish","German","Arabic",
    "Mandarin","Portuguese","Hindi","Swahili","Italian"
  ]

  const countries = [
    "Canada","United States","United Kingdom","France","Germany",
    "Kenya","Nigeria","India","Australia","South Africa",
    "China","Brazil","Italy","Spain","Mexico",
    "Japan","Netherlands","Sweden","Norway","Denmark"
  ]

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    year_of_birth: "",
    languages: "",
    phone_number: "",
    gender: "male",
    nationality: ""
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successEmail, setSuccessEmail] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    try {
      setLoading(true)

      const payload = {
        ...form,
        phone_number: form.phone_number.startsWith("+")
          ? form.phone_number
          : `+${form.phone_number}`,
        year_of_birth: form.year_of_birth
          ? parseInt(form.year_of_birth)
          : null
      }

      await register(payload)

      // Instead of closing modal → show success screen
      setSuccessEmail(form.email)

    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
        "Registration failed. Please check your details."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        {/* ================= SUCCESS SCREEN ================= */}
        {successEmail ? (
          <>
            <h2 style={title}>Verify Your Email</h2>

            <div style={successBox}>
              <p style={{ marginBottom: "10px" }}>
                Check <strong>{successEmail}</strong> to complete your account setup.
              </p>

              <p style={{ color: "#3498db", fontWeight: "600" }}>
                Waiting for you to verify...
              </p>
            </div>

            <button style={primaryBtn} onClick={onClose}>
              Close
            </button>
          </>
        ) : (
          <>
            <h2 style={title}>Create Account 🚀</h2>
            <p style={subtitle}>Start your job journey</p>

            {/* ================= INLINE ERROR ================= */}
            {errorMessage && (
              <div style={errorBox}>
                <span>{errorMessage}</span>
                <button
                  style={closeInline}
                  onClick={() => setErrorMessage("")}
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={formStyle}>

              <input
                style={input}
                name="full_name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />

              <input
                style={input}
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                style={input}
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <input
                style={input}
                type="number"
                name="year_of_birth"
                placeholder="Year of Birth"
                onChange={handleChange}
              />

              <select
                style={input}
                name="languages"
                onChange={handleChange}
                required
              >
                <option value="">Select Language</option>
                {languagesList.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              <PhoneInput
                country={"ca"}
                value={form.phone_number}
                onChange={(phone) =>
                  setForm({ ...form, phone_number: phone })
                }
                inputStyle={{
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  height: "42px"
                }}
              />

              <select
                style={input}
                name="nationality"
                onChange={handleChange}
                required
              >
                <option value="">Select Nationality</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <select
                style={input}
                name="gender"
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <button style={primaryBtn} type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div style={loginText}>
              Already have an account?{" "}
              <span
                style={loginLink}
                onClick={() => {
                  onClose()
                  onSwitchToLogin()
                }}
              >
                Login
              </span>
            </div>

            <button style={closeBtn} onClick={onClose}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
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
  zIndex: 999
}

const modal = {
  background: "white",
  width: "420px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
}

const title = { margin: 0 }
const subtitle = { color: "#666", marginBottom: "20px" }

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const input = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  height: "42px"
}

const primaryBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  marginTop: "10px"
}

const loginText = {
  marginTop: "15px",
  textAlign: "center",
  fontSize: "14px",
  color: "#666"
}

const loginLink = {
  color: "#2ecc71",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "underline"
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

const errorBox = {
  background: "#ffe6e6",
  color: "#c0392b",
  padding: "10px 14px",
  borderRadius: "6px",
  marginBottom: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "14px"
}

const closeInline = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
}

const successBox = {
  background: "#eef7ff",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
  textAlign: "center"
}

export default RegisterModal