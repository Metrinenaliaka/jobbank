import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../api"

import ApplyModal from "../components/ApplyModal"

function JobDetail() {
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
      <div style={wrapper}>

        <h2 style={title}>{job.title}</h2>

        <p style={meta}>
          Posted on {new Date(job.created_at).toLocaleDateString()} by{" "}
          <strong>{job.company_name}</strong>
        </p>

        <button style={applyBtn} onClick={() => setShowApply(true)}>
          Apply Now
        </button>

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
          <div
  dangerouslySetInnerHTML={{ __html: job.benefits }}
/>
        </Section>

        <Section title="Overview">
          <Info label="Languages" value={job.languages} />
          <div
  dangerouslySetInnerHTML={{ __html: job.education }}
/>
          <Info label="Experience" value={job.experience} />
          <div
  dangerouslySetInnerHTML={{ __html: job.work_environment }}
/>
          <Info label="Work Setting" value={job.work_setting} />
        </Section>

        <Section title="Responsibilities">
          <div
  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
/>
        </Section>

        <Section title="Supervision">
          <div
  dangerouslySetInnerHTML={{ __html: job.supervision }}
/>
        </Section>

        <Section title="Specialization">
          <div
  dangerouslySetInnerHTML={{ __html: job.specialization }}
/>
        </Section>

      </div>
    </>
  )
}

/* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div style={section}>
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

const wrapper = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "30px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
}

const title = {
  marginTop: 0,
  marginBottom: "10px"
}

const meta = {
  color: "#666",
  marginBottom: "20px"
}

const section = {
  marginTop: "35px",
  paddingTop: "20px",
  borderTop: "1px solid #eee"
}

const sectionTitle = {
  marginBottom: "15px",
  color: "#2ecc71"
}

const infoRow = {
  marginBottom: "8px"
}

const paragraph = {
  margin: "5px 0 10px 0",
  lineHeight: "1.6",
  color: "#444"
}

const applyBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "15px"
}

export default JobDetail