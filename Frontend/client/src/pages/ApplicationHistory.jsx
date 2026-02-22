import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import API from "../api"

const STEPS = [
  "applied",
  "reviewed",
  "assessment",
  "interview",
  "accepted"
]

function ApplicationHistory() {

  const [applications, setApplications] = useState([])

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("applications/")
        setApplications(res.data.results || res.data)
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch applications")
      }
    }

    fetchApplications()
  }, [])

  return (
    <div style={wrapper}>
      <h2 style={{ marginBottom: "20px" }}>Application History</h2>

      {applications.length === 0 && (
        <p>No applications yet.</p>
      )}

      {applications.map(app => {

        const currentIndex = STEPS.indexOf(app.status)

        return (
          <div key={app.id} style={card}>

            {/* ===== JOB INFO ===== */}
            <h3 style={{ marginBottom: "6px" }}>
              {app.job_title || "Job Application"}
            </h3>

            <p style={muted}>
              {app.company_name || ""}
            </p>

            <p style={muted}>
              Applied on{" "}
              {new Date(app.applied_at).toLocaleDateString()}
            </p>

            {/* ===== TRACKER ===== */}
            <div style={trackerContainer}>
              {STEPS.map((step, index) => {

                const active = index <= currentIndex

                return (
                  <div key={step} style={stepWrapper}>

                    {/* LINE LEFT */}
                    {index !== 0 && (
                      <div
                        style={{
                          ...line,
                          background: index <= currentIndex
                            ? "#2ecc71"
                            : "#ddd"
                        }}
                      />
                    )}

                    {/* CIRCLE */}
                    <div
                      style={{
                        ...circle,
                        background: active ? "#2ecc71" : "#ddd"
                      }}
                    />

                    {/* LABEL */}
                    <span style={label}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>

          </div>
        )
      })}
    </div>
  )
}

/* ===== STYLES ===== */

const wrapper = {
  maxWidth: "950px",
  margin: "40px auto"
}

const card = {
  background: "white",
  padding: "22px",
  marginBottom: "18px",
  borderRadius: "10px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
}

const muted = {
  color: "#666",
  margin: "3px 0"
}

/* ===== TRACKER ===== */

const trackerContainer = {
  display: "flex",
  marginTop: "20px",
  width: "100%",
  alignItems: "center",
  overflowX: "auto",
  paddingBottom: "10px"
}

const stepWrapper = {
  flex: 1,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "100px"
}

const circle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  zIndex: 2
}

const line = {
  position: "absolute",
  top: "9px",
  left: "-50%",
  width: "100%",
  height: "3px",
  zIndex: 1
}

const label = {
  marginTop: "8px",
  fontSize: "13px",
  textTransform: "capitalize",
  color: "#333",
  textAlign: "center"
}


export default ApplicationHistory
