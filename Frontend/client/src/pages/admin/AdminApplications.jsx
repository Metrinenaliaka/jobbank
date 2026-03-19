import { useEffect, useState } from "react"
import API from "../../api"

const STATUSES = [
  "applied",
  "reviewed",
  "assessment",
  "interview",
  "accepted",
  "declined"
]

function AdminApplications() {

  const [applications, setApplications] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  const fetchApplications = async () => {
    const res = await API.get("applications/")
    setApplications(res.data.results || res.data)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`applications/${id}/`, { status })
      fetchApplications()
    } catch (err) {
      setErrorMessage("Failed to update status")

      // Auto clear after 10 seconds
      setTimeout(() => {
        setErrorMessage("")
      }, 10000)
    }
  }

  return (
    <div style={wrapper}>
      <h2>ATS Hiring Pipeline</h2>

      {/* INLINE ERROR MESSAGE */}
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

      <div style={board}>

        {STATUSES.map(status => (
          <div key={status} style={column}>

            <h3 style={columnTitle}>
              {status.toUpperCase()}
            </h3>

            {applications
              .filter(app => app.status === status)
              .map(app => (

              <div key={app.id} style={card}>

                <b>{app.applicant_email}</b>

                <p style={{ margin: "5px 0" }}>
                  {app.job_title}
                </p>

                <small>{app.company_name}</small>

                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
  
                  {app.cv && (
                    <a href={app.cv} target="_blank" rel="noreferrer">
                      📄 View CV
                    </a>
                  )}

                  {app.cover_letter && (
                    <a href={app.cover_letter} target="_blank" rel="noreferrer">
                      📝 View Cover Letter
                    </a>
                  )}

                  {app.passport_photo && (
                    <a href={app.passport_photo} target="_blank" rel="noreferrer">
                      🖼 View Passport Photo
                    </a>
                  )}

                  {app.other_documents && (
                    <a href={app.other_documents} target="_blank" rel="noreferrer">
                      📎 View Other Documents
                    </a>
                  )}

                </div>

                <select
                  value={app.status}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value)
                  }
                  style={select}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

              </div>

            ))}

          </div>
        ))}

      </div>
    </div>
  )
}

/* ===== STYLES ===== */

const wrapper = {
  padding: "20px"
}

const board = {
  display: "flex",
  gap: "15px",
  overflowX: "auto"
}

const column = {
  minWidth: "250px",
  background: "#f8f9fa",
  padding: "10px",
  borderRadius: "8px"
}

const columnTitle = {
  textAlign: "center",
  color: "#2ecc71"
}

const card = {
  background: "white",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
}

const select = {
  marginTop: "8px",
  width: "100%",
  padding: "6px"
}

/* INLINE ERROR */

const errorBox = {
  background: "#ffe6e6",
  color: "#c0392b",
  padding: "10px 14px",
  borderRadius: "6px",
  margin: "15px 0",
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

export default AdminApplications