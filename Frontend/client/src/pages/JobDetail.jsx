import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api"
import Navbar from "../components/Navbar"

function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`jobs/${id}/`)
        setJob(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchJob()
  }, [id])

  const handleApply = () => {
    alert(`Apply clicked for job ${job.id}`)
  }

  if (!job) return <p>Loading...</p>

  return (
    <>
      <Navbar />

      <div className="container">

        <h2>{job.title}</h2>

        <p>
          Posted on{" "}
          {new Date(job.created_at).toLocaleDateString()} by{" "}
          <b>{job.company_name}</b>
        </p>

        <button style={applyBtn} onClick={handleApply}>
          Apply Now
        </button>

        <hr />

        <h3>Job Details</h3>
        <p>📍 {job.location_city}, {job.location_province}</p>
        <p>💼 {job.employment_type}</p>
        <p>🏢 {job.work_mode}</p>
        <p>💰 {job.salary} {job.salary_type}</p>
        <p>📅 Start date: {job.start_date}</p>

        <hr />

        <h3>Overview</h3>
        <p><b>Languages:</b> {job.languages}</p>
        <p><b>Education:</b> {job.education}</p>
        <p><b>Experience:</b> {job.experience}</p>
        <p><b>Work Environment:</b> {job.work_environment}</p>

        <hr />

        <h3>Responsibilities</h3>
        <p>{job.responsibilities}</p>

        <hr />

        <h3>Specialization</h3>
        <p>{job.specialization}</p>

      </div>
    </>
  )
}

const applyBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  marginBottom: "15px"
}

export default JobDetail
