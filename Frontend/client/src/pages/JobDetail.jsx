import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../api"

import ApplyModal from "../components/ApplyModal"

function JobDetail() {
  const isMobile = window.innerWidth < 768
  const { id } = useParams()
  useEffect(() => {
  document.title = "Simizi | Job Details"
}, [])

  const [job, setJob] = useState(null)
  const [showApply, setShowApply] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`jobs/${id}/`)
        setJob(res.data)
      } catch (err) {
        toast.error("Failed to load job.")
      }
    }

    fetchJob()
  }, [id])

  if (!job) return <p style={{ padding: "40px" }}>Loading...</p>

  const formatLabel = (value) => {
    if (!value) return "Not specified"
    return value.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    
    <>
      <div style={wrapper(isMobile)}>

       <div style={header}>
  <div>
    <h2 style={title(isMobile)}>{job.title}</h2>

    <p style={meta}>
      Posted on {new Date(job.created_at).toLocaleDateString()} by{" "}
      <strong>{job.company_name}</strong>
    </p>
  </div>

  <button
  style={applyBtn}
  onClick={() => setShowApply(true)}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
    e.currentTarget.style.boxShadow = `
      0 15px 35px rgba(34,197,94,0.45),
      0 0 35px rgba(34,197,94,0.3)
    `
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)"
    e.currentTarget.style.boxShadow = `
      0 10px 25px rgba(34,197,94,0.35),
      0 0 30px rgba(34,197,94,0.25)
    `
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.96)"
  }}
>
  Apply Now
</button>
</div>

        {showApply && (
          <ApplyModal
            jobId={job.id}
            onClose={() => setShowApply(false)}
          />
        )}

        <Section title="Job Details">
          <Info label="Location" value={`${job.location_city}, ${job.location_province}`} />
          <Info label="Employment Type" value={formatLabel(job.employment_type)} />
          <Info label="Work Mode" value={formatLabel(job.work_mode)} />
          <Info label="Salary" value={
            job.salary
              ? `${job.salary} ${job.salary_type || ""}`
              : "Not specified"
          } />
          <Info label="Hours per Week" value={
            job.hours_per_week
              ? `${job.hours_per_week} hours`
              : "Not specified"
          } />
          <Info label="Vacancies" value={job.vacancies} />
          <Info label="Start Date" value={job.start_date} />
        </Section>

        <Section title="Benefits">
          <div style={richText}
  dangerouslySetInnerHTML={{ __html: job.benefits }}
/>
        </Section>

        <Section title="Overview">
          <Info label="Languages" value={job.languages} />
          <div style={richText}
  dangerouslySetInnerHTML={{ __html: job.education }}
/>
          <Info label="Experience" value={job.experience} />
          <div style={richText}
  dangerouslySetInnerHTML={{ __html: job.work_environment }}
/>
          <Info label="Work Setting" value={job.work_setting} />
        </Section>

        <Section title="Responsibilities">
          <div style={richText}
  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
/>
        </Section>

        <Section title="Supervision">
          <div style={richText}
  dangerouslySetInnerHTML={{ __html: job.supervision }}
/>
        </Section>

        <Section title="Specialization">
          <div style={richText}
  dangerouslySetInnerHTML={{ __html: job.specialization }}
/>
        </Section>

      </div>
    </>
  )
}

/* ================= REUSABLE COMPONENTS ================= */
const Section = ({ title, children }) => (
  <div style={sectionCard}>
    <h3 style={sectionTitle}>{title}</h3>
    {children}
  </div>
)

const Info = ({ label, value }) => (
  <p style={infoRow}>
    <strong>{label}:</strong>{" "}
    {value && value !== "" ? value : "Not specified"}
  </p>
)

const Paragraph = ({ label, text }) => (
  <div style={{ marginBottom: "10px" }}>
    {label && <strong>{label}: </strong>}
    <p style={paragraph}>
      {text && text !== "" ? text : "Not specified"}
    </p>
  </div>
)

/* ================= STYLES ================= */

const wrapper = (isMobile) => ({
  maxWidth: "900px",
  margin: isMobile ? "20px auto" : "60px auto",
  padding: isMobile ? "20px 16px" : "30px",

  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(14px)",

  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: "0 12px 40px rgba(0,0,0,0.08)"
})
const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "20px"
}
const title = (isMobile) => ({
  margin: 0,
  fontSize: isMobile ? "22px" : "28px",
  fontWeight: "700",
  color: "#065f46"
})
const sectionCard = {
  marginTop: "20px",
  padding: "18px",

  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(10px)",

  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
}
const richText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#374151"
}
const sectionTitle = {
  marginBottom: "12px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#16a34a"
}
const meta = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px"
}
const section = {
  marginTop: "35px",
  paddingTop: "20px",
  borderTop: "1px solid #eee"
}



const infoRow = {
  marginBottom: "8px",
  fontSize: "14px",
  color: "#374151"
}

const paragraph = {
  margin: "5px 0 10px 0",
  lineHeight: "1.6",
  color: "#444"
}

const applyBtn = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",

  boxShadow: `
    0 10px 25px rgba(34,197,94,0.35),
    0 0 30px rgba(34,197,94,0.25)
  `,

  transition: "all 0.2s ease"
}
export default JobDetail