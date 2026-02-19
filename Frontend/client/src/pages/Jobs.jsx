import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import Navbar from "../components/Navbar"

function Jobs() {
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("jobs/")
        setJobs(res.data.results || res.data)
      } catch (err) {
        console.error("Error fetching jobs:", err)
      }
    }

    fetchJobs()
  }, [])

  const handleApply = (jobId, e) => {
    e.stopPropagation() // Prevent card click
    alert(`Apply clicked for job ${jobId}`)
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Available Jobs</h2>

        {jobs.length === 0 && <p>No jobs available</p>}

        {jobs.map(job => (
          <div
            key={job.id}
            style={cardStyle}
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <div style={rowStyle}>
              
              {/* LEFT SIDE */}
              <div>
                <h3 style={{ marginBottom: "6px" }}>{job.title}</h3>
                <p>{job.company_name}</p>
                <p>{job.location_city}, {job.location_province}</p>

                {job.salary && (
                  <p>
                    Salary: ${job.salary} {job.salary_type}
                  </p>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div>
                <p style={dateStyle}>
                  {new Date(job.created_at).toLocaleDateString()}
                </p>

                <button
                  style={applyBtn}
                  onClick={(e) => handleApply(job.id, e)}
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ===== Styles ===== */

const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "12px",
  background: "white",
  borderRadius: "6px",
  cursor: "pointer"
}

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start"
}

const dateStyle = {
  color: "#666",
  fontSize: "13px",
  marginBottom: "10px"
}

const applyBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer"
}

export default Jobs
