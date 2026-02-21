import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function RegisterModal({ onClose, onSwitchToLogin }) {

  const { register } = useContext(AuthContext)

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...form,
        year_of_birth: parseInt(form.year_of_birth)
      }

      await register(payload)

      alert("Registered! Check email to verify.")
      onClose()

    } catch (err) {
      console.log(err.response?.data)
      alert(JSON.stringify(err.response?.data))
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        <h2 style={title}>Create Account 🚀</h2>
        <p style={subtitle}>Start your job journey</p>

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

          <input
            style={input}
            name="languages"
            placeholder="Languages"
            onChange={handleChange}
          />

          <input
            style={input}
            name="phone_number"
            placeholder="+254712345678"
            onChange={handleChange}
          />

          <input
            style={input}
            name="nationality"
            placeholder="Nationality"
            onChange={handleChange}
          />

          <select style={input} name="gender" onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button style={primaryBtn} type="submit">
            Sign Up
          </button>

        </form>

        {/* 🔥 NEW LOGIN SECTION */}
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
  width: "380px",
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
  gap: "10px"
}

const input = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px"
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

export default RegisterModal