import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast" 
import API from "../api"

import ApplyModal from "../components/ApplyModal"

function JobDetail() {

  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [showApply, setShowApply] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      const res = await API.get(`jobs/${id}/`)
      setJob(res.data)
    }

    fetchJob()
  }, [id])

  if (!job) return <p>Loading...</p>

  return (
    <>
      

      <div className="container">

        <h2>{job.title}</h2>

        <p>
          Posted on {new Date(job.created_at).toLocaleDateString()}
          {" "}by <b>{job.company_name}</b>
        </p>

        {/* ⭐ APPLY BUTTON */}
        <button style={applyBtn} onClick={() => setShowApply(true)}>
          Apply Now
        </button>

        {showApply && (
          <ApplyModal
            jobId={job.id}
            onClose={() => setShowApply(false)}
          />
        )}

        <hr />

        <h3>Job Details</h3>
        <p>📍 {job.location_city}, {job.location_province}</p>
        <p>💼 {job.employment_type}</p>
        <p>🏢 {job.work_mode}</p>
        <p>💰 {job.salary} {job.salary_type}</p>

        <hr />

        <h3>Overview</h3>
        <p>{job.education}</p>

        <hr />

        <h3>Responsibilities</h3>
        <p>{job.responsibilities}</p>

      </div>
    </>
  )
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
