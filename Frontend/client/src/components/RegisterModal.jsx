import { useState, useContext, useEffect } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { AuthContext } from "../context/AuthContext"
import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"

countries.registerLocale(en)

function RegisterModal({ onClose, onSwitchToLogin }) {

  const { register } = useContext(AuthContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])

  const languagesList = [
    "English","French","Spanish","German","Arabic",
    "Mandarin","Portuguese","Hindi","Swahili","Italian"
  ]

  const countryList = Object.values(
  countries.getNames("en", { select: "official" })
)
  const fieldLabels = {
  email: "Email",
  phone_number: "Phone number",
  password: "Password",
  full_name: "Full name"
}
 const getErrorMessage = (error) => {

  const data = error.response?.data

  if (!data) return "Registration failed. Please try again."

  if (data.detail) return data.detail

  const messages = []

  for (const key in data) {
    if (Array.isArray(data[key])) {

      const label = fieldLabels[key] || key

      messages.push(`${label}: ${data[key].join(", ")}`)
    }
  }

  return messages.join(" | ")
}

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
  const [successData, setSuccessData] = useState(null)

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

      const response = await register(payload)

      setSuccessData({
        email: form.email,
        userId: response?.data?.id
      })

    } catch (err) {

      setErrorMessage(getErrorMessage(err))

    } finally {

      setLoading(false)

    }

  }

  return (
    <div style={overlay}>
      <div style={modal(isMobile)}>

        {successData ? (

          <>
            <h2 style={title}>Verify Your Email</h2>


            <div style={successBox}>

              <p style={{ marginBottom: "10px" }}>
                Check <strong>{successData.email}</strong> to complete your account setup.
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
              onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
                style={{ ...input, color: "#000" }}
                name="full_name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />

              <input
              onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
                style={{ ...input, color: "#000" }}
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
              onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
                style={{ ...input, color: "#000" }}
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <input
              onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
                style={{ ...input, color: "#000" }}
                
                type="number"
                name="year_of_birth"
                placeholder="Year of Birth"
                onChange={handleChange}
              />

              <select
                style={{ ...input, color: "#000" }}
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
              onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.15)"
  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
}}
                country={"ca"}
                value={form.phone_number}
                onChange={(phone) =>
                  setForm({ ...form, phone_number: phone })
                }
                inputStyle={{
  width: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.15)",
  height: "44px",
  background: "#ffffff",
  fontSize: "16px",
  color: "#000000",
}}
              />

              <select
                style={{ ...input, color: "#000" }}
                name="nationality"
                onChange={handleChange}
                required
              >
                <option value="">Select Nationality</option>
               {countryList.map((country) => (
  <option key={country} value={country}>
    {country}
  </option>
))}
              </select>

              <select
                style={{ ...input, color: "#000" }}
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
  background: "rgba(15, 23, 42, 0.35)",
  backdropFilter: "blur(6px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000
}

const modal = (isMobile) => ({
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(18px)",

  width: "420px",
  maxWidth: "92%",
  maxHeight: "90vh",

  overflowY: "auto",

  padding: isMobile ? "20px 16px" : "28px",

  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",

  color: "#1f2937"
})
const title = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "700",
  color: "#065f46"
}

const subtitle = {
  color: "rgba(15,23,42,0.7)",
  marginBottom: "18px",
  fontSize: "14px"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const input = {
  padding: "12px",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "10px",
  height: "44px",

  background: "#ffffff", // 🔥 IMPORTANT (not glass)
   color: "#000000",

  fontSize: "14px",

  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease"
}

const primaryBtn = {
  background: "linear-gradient(135deg, #22c55e, #8f75d6)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  marginTop: "10px",

  boxShadow: "0 10px 25px rgba(34,197,94,0.3)",
  transition: "all 0.2s ease"
}


const telegramBtn = {
  display: "inline-block",
  background: "#0088cc",
  color: "white",
  padding: "10px 14px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600"
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
  background: "#fa0c0c",
  borderRadius: "6px",
  cursor: "pointer"
}

const errorBox = {
  background: "rgba(239,68,68,0.1)",
  color: "#b91c1c",
  padding: "10px 14px",
  borderRadius: "8px",
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
  background: "rgba(34,197,94,0.1)",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  textAlign: "center",
  color: "#065f46"
}

export default RegisterModal