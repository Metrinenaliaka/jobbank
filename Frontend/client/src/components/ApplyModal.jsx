import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"

function ApplyModal({ jobId, onClose }) {

  const navigate = useNavigate()

  const [cv, setCv] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [otherDocs, setOtherDocs] = useState(null)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!cv || !coverLetter || !photo) {
      setErrorMessage("CV, Cover Letter and Passport Photo are required.")
      return
    }

    const data = new FormData()
    data.append("job", jobId)
    data.append("cv", cv)
    data.append("cover_letter", coverLetter)
    data.append("passport_photo", photo)

    if (otherDocs) {
      data.append("other_documents", otherDocs)
    }

    try {
      setLoading(true)

      await API.post("applications/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      // Show payment popup instead of toast
      setShowPaymentPopup(true)

    }catch (err) {
  if (err.response?.data) {
    const data = err.response.data

    // If backend sends non_field_errors
    if (data.non_field_errors) {
      setErrorMessage(data.non_field_errors[0])
    }
    // If backend sends field-specific errors
    else if (typeof data === "object") {
      const firstKey = Object.keys(data)[0]
      setErrorMessage(data[firstKey][0])
    } else {
      setErrorMessage("Failed to submit application.")
    }
  } else {
    setErrorMessage("Something went wrong. Please try again.")
  }
}finally {
      setLoading(false)
    }
  }

  const handlePaymentContinue = () => {
    setShowPaymentPopup(false)
    onClose() // close apply modal
    navigate("/applications") // redirect to application history
  }

  return (
    <>
      {/* MAIN APPLY MODAL */}
      <div style={overlay}>
        <div style={modal(isMobile)}>

          <div style={header}>
            <h2 style={{
  margin: 0,
  fontSize: "20px",
  fontWeight: "700",
  color: "#065f46"
}}>
  Apply for Job
</h2>
            <p style={subtitle}>
              Upload the required documents below. Large files will not be accepted.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>

            <FileInput
              label="CV (PDF only)"
              accept="application/pdf"
              file={cv}
              onChange={e => setCv(e.target.files[0])}
              required
            />

            <FileInput
              label="Cover Letter (PDF only)"
              accept="application/pdf"
              file={coverLetter}
              onChange={e => setCoverLetter(e.target.files[0])}
              required
            />

            <FileInput
              label="Passport Photo (Image only)"
              accept="image/*"
              file={photo}
              onChange={e => setPhoto(e.target.files[0])}
              required
            />

            <FileInput
              label="Other Documents (Optional)"
              file={otherDocs}
              onChange={e => setOtherDocs(e.target.files[0])}
            />

            {errorMessage && (
              <p style={errorStyle}>{errorMessage}</p>
            )}

            <div style={buttonRow(isMobile)}>
              <button
                type="button"
                style={cancelBtn(isMobile)}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  ...submitBtn(isMobile),
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
                onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-2px)"
  e.currentTarget.style.boxShadow = "0 15px 35px rgba(99,102,241,0.5)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
}}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* PAYMENT REQUIRED POPUP */}
      {showPaymentPopup && (
        <div style={overlay}>
          <div style={popupModal}>
            <h3>Payment Required</h3>
            <p style={{ marginTop: "10px" }}>
              A payment of <strong>350 CAD</strong> is required before your
              application can proceed to review.
            </p>

            <button
              onClick={handlePaymentContinue}
              style={submitBtn(isMobile)}
            >
              Continue to Application History
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ================= REUSABLE FILE INPUT ================= */

function FileInput({ label, accept, onChange, file, required }) {
  return (
    <div style={fileGroup}>
      <label style={fileLabel}>{label}</label>

      <label style={fileBox}>
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          required={required}
          style={{ display: "none" }}
          onMouseEnter={e => {
    e.currentTarget.style.background = "rgba(99,102,241,0.15)"
    e.currentTarget.style.border = "1px dashed #6366F1"
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)"
    e.currentTarget.style.border = "1px dashed rgba(255,255,255,0.25)"
  }}
        />
        {file ? file.name : "Click to upload file"}
      </label>
    </div>
  )
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.35)", // softer dark blur
  backdropFilter: "blur(6px)", // darker, richer
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
  
  animation: "fadeIn 0.3s ease"
}
const modal = (isMobile) => ({
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(18px)",

  padding: isMobile ? "20px 16px" : "28px",
  borderRadius: "18px",

  width: "520px",
  maxWidth: "95%",

  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  border: "1px solid rgba(255,255,255,0.4)",

  color: "#1f2937",
  animation: "slideUp 0.3s ease"
})
const popupModal = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(16px)",

  padding: "24px",
  borderRadius: "16px",
  width: "400px",
  maxWidth: "90%",

  textAlign: "center",

  boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
  border: "1px solid rgba(255,255,255,0.4)"
}
const header = { marginBottom: "20px" }

const subtitle = {
  fontSize: "14px",
  color: "rgba(15, 23, 42, 0.7)",
  marginTop: "6px"
}

const fileLabel = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "18px"
}

const fileGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
}


const fileBox = {
  border: "1px dashed rgba(0,0,0,0.15)",
  padding: "16px",
  borderRadius: "12px",
  cursor: "pointer",
  textAlign: "center",
  fontSize: "14px",

  background: "rgba(255,255,255,0.6)",
  color: "#374151",

  transition: "all 0.25s ease"
}

const buttonRow = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "10px",
  marginTop: "10px"
})

const submitBtn = (isMobile) => ({
  background: "linear-gradient(135deg, #22c55e, #6416a3)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  width: isMobile ? "100%" : "auto",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.25s ease",
  boxShadow: "0 10px 25px rgba(34,197,94,0.35)"
})

const cancelBtn = (isMobile) => ({
  background: "rgba(253, 10, 10, 0.97)",
  color: "#fcfcfc",
  border: "1px solid rgba(0,0,0,0.1)",
  padding: "12px 20px",
  width: isMobile ? "100%" : "auto",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "500"
})
const errorStyle = {
  color: "red",
  fontWeight: "500",
  marginTop: "5px"
}

export default ApplyModal