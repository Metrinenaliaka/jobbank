import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import { Search, Funnel, MapPin, ExternalLink} from "lucide-react"
import toast from "react-hot-toast"

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [selectedJobId, setSelectedJobId] = useState(null)
  
  const [loading, setLoading] = useState(false)
 
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = window.innerWidth < 768
  useEffect(() => {
  document.title = "Simizi | Jobs"
}, [])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("jobs/")
        
        setJobs(res.data.results || res.data)
        
      } catch (err) {
        toast.error("Failed to fetch jobs.")
      }
    }

   

    fetchJobs()
   
  }, [])

 const handleApply = (jobId, e) => {
  e.stopPropagation()
  navigate(`/jobs/${jobId}`)
}


  const formatEmploymentType = (type) => {
  if (!type) return ""

  return type
    .split("_")                  // ["full", "time"]
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    )                            // ["Full", "Time"]
    .join(" ")                   // "Full Time"
}

  
  const getTagColor = (name) => {
  const colors = [
    "#e3f2fd",
    "#fce4ec",
    "#e8f5e9",
    "#fff3e0",
    "#ede7f6",
    "#f3e5f5",
    "#e0f7fa"
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

  return (
    <>
      <div style={pageStyle}>
        <p style={infoText}>
          Create an account and login for Simizi's assistance in navigating jobs,
          writing a Canadian resume and cover letter, and more.
        </p>
        <div style={filterBar(isMobile)}>
  <div style={searchBox}>
    <Search size={18} />
    <input
  placeholder="Find jobs..."
  style={searchInput}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
    <div style={filterBtn}>
    <Funnel size={18} /> 
  </div>
  </div>

  
</div>

        <h2 style={titleStyle(isMobile)}>Job Board</h2>

        {jobs.length === 0 && <p>No jobs available</p>}

        {jobs.filter((job) =>
        
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location_city || "").toLowerCase().includes(searchTerm.toLowerCase())
  ).map((job) => (
    
          <div
            key={job.id}
            style={cardStyle(isMobile)}
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <div style={cardHeader}>
  <h3>{job.title}</h3>

  {job.employment_type && (
    <span style={employmentTag}>
      {formatEmploymentType(job.employment_type)}
    </span>
  )}
</div>
            {job.tags && job.tags.length > 0 && (
  <div style={tagsWrapper}>
    {job.tags.map(tag => (
      <span
        key={tag.id}
        style={{
          ...tagStyle,
          background: getTagColor(tag.name)
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {tag.name}
      </span>
    ))}
  </div>
)}
            <p>Employer: {job.company_name}</p>
            <div style={locationRow}>
  <MapPin size={16} style={locationIcon} />
  <span>{job.location_city || "None Specified"}</span>
</div>
            <p>Province/State: {job.location_province || "None Specified"}</p>

            <div style={buttonRow(isMobile)}>
              {/* <button style={secondaryBtn}
              onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-1px)"
  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
}}>Location Info</button> */}

              <button
                style={secondaryBtn}
                onClick={(e) => {
  e.stopPropagation()
  window.open(
    "https://www.resume-now.com/lp/rnarsmsm63.aspx?utm_source=google&utm_medium=sem&utm_campaign=174127281&utm_term=free%20resume%20now&network=g&device=m",
    "_blank"
  )
}}
                onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-1px)"
  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
}}
              >
                Write Resume <ExternalLink size={14} style={{ marginLeft: "6px" }} />
              </button>

              <button
                style={secondaryBtn}
                onClick={(e) => {
  e.stopPropagation()
  window.open(
    "https://www.myperfectcoverletter.com/build-letter/mobile/creation-mode?utm_source=google&utm_medium=sem&utm_campaign=20498128053&utm_term=free+cover+letter+builder&network=g&device=t",
    "_blank"
  )
}}
                onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-1px)"
  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
}}
              >
                Write Cover Letter <ExternalLink size={14} style={{ marginLeft: "6px" }} />
              </button>

              <button
                style={applyBtn}
                onClick={(e) => handleApply(job.id, e)}
                onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0) scale(1)"
  }}
  onMouseDown={e => {
    e.currentTarget.style.transform = "scale(0.95)"
  }}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

     
    </>
  )
}

export default Jobs

/* ===== STYLES ===== */

const pageStyle = {
  maxWidth: "900px",
  margin: "80px auto 40px", // 🔥 push below WhatsApp bar
  padding: "0 16px",
  fontFamily: "Inter, sans-serif",
  position: "relative",
  zIndex: 2
}

const infoText = {
  marginBottom: "20px",
  fontWeight: "500",
  fontSize: "25px",
  fontFamily: "Georgia, serif",
  color: "#06f385",
}

const titleStyle = (isMobile) => ({
  color: "#065f46",
  marginBottom: "16px",
  fontSize: isMobile ? "22px" : "30px", // 🔥 responsive
  fontWeight: "700"
})

const cardStyle = (isMobile) => ({
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(18px)",

  borderRadius: "16px",
  padding: isMobile ? "16px" : "20px", // 🔥 smaller on mobile
  marginBottom: "16px",

  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: "0 12px 30px rgba(34,197,94,0.08)",

  cursor: "pointer"
})
const filterBar = (isMobile) => ({
  display: "flex",
  gap: "10px",
  marginBottom: "18px",
  alignItems: "center"
})

const searchBox = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  borderRadius: "12px",
  color: "#111",
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(12px)",

  border: "1px solid rgba(255,255,255,0.4)"
}

const searchInput = {
  border: "none",
  outline: "none",
  background: "transparent",
  flex: 1
}
const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}
const locationRow = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginTop: "6px",
  color: "#374151",
  fontSize: "14px"
}

const locationIcon = {
  color: "#920909", // matches your theme
  flexShrink: 0
}

const employmentTag = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",

  textTransform: "none", // important

  boxShadow: `
    0 6px 14px rgba(34,197,94,0.35),
    0 0 20px rgba(34,197,94,0.25)
  `
}

const filterBtn = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(12px)",

  border: "1px solid rgba(255,255,255,0.4)",
  cursor: "pointer"
}

const buttonRow = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile
    ? "1fr 1fr"   // 2 per row
    : "repeat(4, 1fr)",
  gap: "10px",
  marginTop: "14px"
})
const secondaryBtn = {
  border: "none",
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(8px)",
  color: "#111",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",

  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease"
}

const applyBtn = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",

  boxShadow: `
    0 10px 25px rgba(34,197,94,0.35),
    0 0 30px rgba(34,197,94,0.25),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,

  transition: "all 0.2s ease"
}

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000,
}

const modalBox = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
}

const modalInput = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
}

const modalButtonRow = {
  display: "flex",
  justifyContent: "space-between",
}

const cancelBtn = {
  background: "#141313",
  border: "none",
  padding: "10px 15px",
  borderRadius: "6px",
  cursor: "pointer",
}

const submitBtn = {
  background: "#0066ff",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "6px",
  cursor: "pointer",
}

const paymentInfo = {
  fontSize: "14px",
  marginBottom: "10px",
}
const tagsWrapper = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "10px"
}

const tagStyle = {
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#333"
}