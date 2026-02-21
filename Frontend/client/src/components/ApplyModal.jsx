import { useState } from "react"
import API from "../api"

function ApplyModal({ jobId, onClose }) {

  const [cv, setCv] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [certs, setCerts] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = new FormData()

      data.append("job", jobId)
      data.append("cv", cv)
      data.append("passport_photo", photo)
      data.append("certificates", certs)

      await API.post("applications/", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      alert("Application submitted successfully!")
      onClose()

    } catch (err) {
    alert(err.response?.data?.non_field_errors?.[0] || "Failed to submit application")
    }

  }

  return (
    <div style={overlay}>
      <div style={modal}>

        <h3 style={{ marginTop: 0 }}>Apply for Job</h3>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input type="file" onChange={e => setCv(e.target.files[0])} required />
          <input type="file" onChange={e => setPhoto(e.target.files[0])} required />
          <input type="file" onChange={e => setCerts(e.target.files[0])} required />

          <button style={submitBtn}>Submit Application</button>
        </form>

        <button style={closeBtn} onClick={onClose}>
          Cancel
        </button>

      </div>
    </div>
  )
}

/* ===== STYLES ===== */

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
  padding: "25px",
  borderRadius: "10px",
  width: "350px"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
}

const submitBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer"
}

const closeBtn = {
  marginTop: "10px",
  width: "100%",
  padding: "10px",
  border: "none",
  background: "#eee",
  borderRadius: "6px",
  cursor: "pointer"
}

export default ApplyModal
