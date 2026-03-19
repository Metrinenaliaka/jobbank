import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"

function ApplyForm({ jobId }) {

  const navigate = useNavigate()

  const [cv, setCv] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [otherDocs, setOtherDocs] = useState(null)

  const [errorMessage, setErrorMessage] = useState("")
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateFileType = (file, allowedTypes) => {
    if (!file) return false
    return allowedTypes.includes(file.type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!cv || !coverLetter || !photo) {
      setErrorMessage("CV, Cover Letter and Passport Photo are required.")
      return
    }

    if (!validateFileType(cv, ["application/pdf"])) {
      setErrorMessage("CV must be a PDF file.")
      return
    }

    if (!validateFileType(coverLetter, ["application/pdf"])) {
      setErrorMessage("Cover Letter must be a PDF file.")
      return
    }

    if (!validateFileType(photo, ["image/jpeg", "image/png", "image/jpg", "image/webp"])) {
      setErrorMessage("Passport Photo must be an image (jpg, png, webp).")
      return
    }

    const formData = new FormData()
    formData.append("job", jobId)
    formData.append("cv", cv)
    formData.append("cover_letter", coverLetter)
    formData.append("passport_photo", photo)

    if (otherDocs) {
      formData.append("other_documents", otherDocs)
    }

    try {
      setLoading(true)

      await API.post("applications/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      // Show payment popup instead of toast
      setShowPaymentPopup(true)

    } catch (err) {
      setErrorMessage(
        err.response?.data
          ? "Failed to submit application."
          : "Something went wrong."
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePopupClose = () => {
    setShowPaymentPopup(false)
    navigate("/applications") // Redirect to Application History
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3>Apply</h3>

        <p><strong>Upload the required documents below:</strong></p>

        <div>
          <label>CV (PDF only)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setCv(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label>Cover Letter (PDF only)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setCoverLetter(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label>Passport Photo (Image files only)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPhoto(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label>Other Documents (Optional)</label>
          <input
            type="file"
            onChange={e => setOtherDocs(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        {errorMessage && (
          <p style={errorStyle}>{errorMessage}</p>
        )}
      </form>

      {/* PAYMENT REQUIRED POPUP */}
      {showPaymentPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h3>Payment Required</h3>
            <p>
              A payment of <strong>350 CAD</strong> is required before
              your application can proceed to review.
            </p>

            <button onClick={handlePopupClose} style={confirmBtn}>
              Continue to Application History
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ApplyForm

/* ================= STYLES ================= */

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const errorStyle = {
  color: "red",
  marginTop: "10px",
  fontWeight: "500"
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
}

const popupStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "400px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
}

const confirmBtn = {
  marginTop: "20px",
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer"
}