import { useState } from "react"
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
        <div style={modal}>

          <div style={header}>
            <h2 style={{ margin: 0 }}>Apply for Job</h2>
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

            <div style={buttonRow}>
              <button
                type="button"
                style={cancelBtn}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  ...submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
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
              style={submitBtn}
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
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
  backdropFilter: "blur(3px)"
}

const modal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  width: "500px",
  maxWidth: "95%",
  boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
}

const popupModal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  width: "400px",
  textAlign: "center",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
}

const header = { marginBottom: "20px" }

const subtitle = {
  fontSize: "14px",
  color: "#666",
  marginTop: "6px"
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

const fileLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333"
}

const fileBox = {
  border: "2px dashed #ccc",
  padding: "16px",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "center",
  fontSize: "14px",
  background: "#fafafa"
}

const buttonRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px"
}

const submitBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
}

const cancelBtn = {
  background: "#f1f1f1",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer"
}

const errorStyle = {
  color: "red",
  fontWeight: "500",
  marginTop: "5px"
}

export default ApplyModal