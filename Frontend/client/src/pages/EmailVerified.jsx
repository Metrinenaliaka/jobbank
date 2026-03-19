import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

function EmailVerified() {

  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
  document.title = "Simizi | Email Verified"
}, [])

  const query = new URLSearchParams(location.search)
  const status = query.get("status")

  const renderContent = () => {

    if (status === "success") {
      return (
        <>
          <h1 style={title}>Email Verified ✅</h1>
          <p style={text}>
            Your email has been successfully verified.
          </p>
          <p style={note}>
            You may now return to login.
          </p>
        </>
      )
    }

    if (status === "expired") {
      return (
        <>
          <h1 style={title}>Verification Expired</h1>
          <p style={text}>
            This verification link has expired.
          </p>
        </>
      )
    }

    return (
      <>
        <h1 style={title}>Invalid Verification Link</h1>
        <p style={text}>
          This link is invalid or already used.
        </p>
      </>
    )
  }

  return (
    <div style={wrapper}>
      <div style={card}>

        <h2 style={brand}>SIMIZI</h2>

        {renderContent()}

        <button
          style={button}
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>

      </div>
    </div>
  )
}

export default EmailVerified


/* ===== STYLES ===== */

const wrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "white",
}

const card = {
  background: "#111827",
  padding: "50px",
  borderRadius: "16px",
  textAlign: "center",
  width: "450px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
}

const brand = {
  marginBottom: "30px",
  letterSpacing: "2px",
  fontWeight: "700"
}

const title = {
  marginBottom: "15px"
}

const text = {
  color: "#cbd5e1",
  marginBottom: "10px"
}

const note = {
  fontSize: "14px",
  color: "#94a3b8",
  marginBottom: "20px"
}

const button = {
  marginTop: "20px",
  background: "#2ecc71",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
}