import { useState } from "react"
import API from "../api"
import toast from "react-hot-toast"

function ApplyModal({ jobId, onClose }) {

  const [cv, setCv] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [otherDocs, setOtherDocs] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cv || !coverLetter || !photo) {
      toast.error("CV, Cover Letter and Passport Photo are required.")
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
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      toast.success("Application submitted successfully!")
      onClose()

    } catch (err) {
      console.log("APPLICATION ERROR:", err.response?.data)
      toast.error(
        JSON.stringify(err.response?.data) ||
        "Failed to submit application"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        <div style={header}>
          <h2 style={{ margin: 0 }}>Apply for Job</h2>
          <p style={subtitle}>
            Upload the required documents below
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
  )
}

/* ===========================
   Reusable File Input
=========================== */

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

/* ===========================
   STYLES
=========================== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
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

const header = {
  marginBottom: "20px"
}

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
  background: "#fafafa",
  transition: "all 0.2s ease"
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
  transition: "all 0.2s ease"
}

const cancelBtn = {
  background: "#f1f1f1",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
}

export default ApplyModal