import { useEffect, useState } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom"
import { SlidersHorizontal } from "lucide-react"
import PaymentModal from "../components/PaymentModal"
import {
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaUniversity,
  FaMobileAlt
} from "react-icons/fa"

const BASE_STEPS = [
  "applied",
  "reviewed",
  "assessment",
  "interview",
  "accepted",
  "declined"
]
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

function ApplicationHistory() {

  const [applications, setApplications] = useState([])
   const navigate = useNavigate()
   const isMobile = useIsMobile()
  const [selectedApp, setSelectedApp] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const FILTERS = ["all", ...BASE_STEPS]
  useEffect(() => {
  document.title = "Simizi | Application History"
}, [])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await API.get("applications/")
      setApplications(res.data.results || res.data)
    } catch (err) {
      console.error("Failed to fetch applications", err)
    }
  }

  const handlePaymentSuccess = (applicationId) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, latest_payment_status: "pending" }
          : app
      )
    )
  }
  const getCounts = () => {
  const counts = { all: applications.length }

  BASE_STEPS.forEach(step => {
    counts[step] = applications.filter(app => app.status === step).length
  })

  return counts
}

const counts = getCounts()
  const filteredApplications =
  activeFilter === "all"
    ? applications
    : applications.filter(app => app.status === activeFilter)

  return (
    
    <div style={wrapper(isMobile)}>
      <div style={bgGlow} />
      <div style={headerRow}>
  <h2 style={{ marginBottom: "10px" }}>Application History</h2>

  <button style={filterIconBtn}>
    <SlidersHorizontal size={18} />
    {!isMobile && <span style={{ marginLeft: "6px" }}>Filter</span>}
  </button>
</div>
      <div style={filterWrapper(isMobile)}>
  {FILTERS.map(filter => {
  const isActive = activeFilter === filter

  return (
    <button
      key={filter}
      onClick={() => setActiveFilter(filter)}
      style={{
        ...filterBtn(isMobile),
        background: isActive
          ? "linear-gradient(135deg, #22c55e, #16a34a)"
          : "rgba(255,255,255,0.6)",
        color: isActive ? "#fff" : "#333",
        boxShadow: isActive
          ? "0 6px 20px rgba(34,197,94,0.4)"
          : "none"
      }}
    >
      {filter.replace("_", " ")} ({counts[filter] || 0})
    </button>
  )
})}
</div>

      

      {/* ================= APPLICATIONS ================= */}

      {applications.length === 0 && (
        <p>No applications yet.</p>
      )}

      {filteredApplications.map(app => {

        const paymentStatus = app.latest_payment_status || "not_paid"

        const canMakePayment =
  paymentStatus === "not_paid" || paymentStatus === "rejected"

// BUT ALSO ensure only first application shows it
const firstAppId = Math.min(...applications.map(a => a.id))
const isFirstApplication = app.id === firstAppId

const shouldShowPayment =
  canMakePayment && isFirstApplication
        const isPending = paymentStatus === "pending"
        const isVerified = paymentStatus === "verified"
        const isRejected = paymentStatus === "rejected"

        let steps = [...BASE_STEPS]
        if (app.status === "accepted") {
  steps = steps.filter(step => step !== "declined")
}

if (app.status === "declined") {
  steps = steps.filter(step => step !== "accepted")
}

        if (app.status === "applied") {
          steps = [
            "applied",
            "pending_payment",
            "reviewed",
            "assessment",
            "interview",
            "accepted"
          ]
        }
        

        let trackerStep = app.status

        if (app.status === "applied") {
          if (isPending || isVerified) {
            trackerStep = "pending_payment"
          }
        }

        const currentIndex = steps.indexOf(trackerStep)

        return (
          <div key={app.id} style={card(isMobile)}
          onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-6px) scale(1.01)"
  e.currentTarget.style.boxShadow = `
    0 25px 70px rgba(34,197,94,0.18),
    0 0 80px rgba(34,197,94,0.12),
    inset 0 1px 0 rgba(255,255,255,0.8)
  `
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0) scale(1)"
  e.currentTarget.style.boxShadow = `
    0 10px 40px rgba(34,197,94,0.12),
    0 0 60px rgba(34,197,94,0.08),
    inset 0 1px 0 rgba(255,255,255,0.7)
  `
}}
>
            <div style={sparkle} />

            <h3 style={{ marginBottom: "6px" }}>
              {app.job_title || "Job Application"}
            </h3>

            <p style={muted}>{app.company_name || ""}</p>

            <p style={muted}>
              Applied on {new Date(app.applied_at).toLocaleDateString()}
            </p>

            {/* TRACKER */}
            <div style={trackerContainer(isMobile)}>
              {steps.map((step, index) => {
  const active = index <= currentIndex

  const isDeclined = step === "declined"
  const isAccepted = step === "accepted"

  let bgColor = "#ddd"

  if (isDeclined && trackerStep === "declined") {
    bgColor = "#ef4444"
  } else if (isAccepted && trackerStep === "accepted") {
    bgColor = "#22c55e"
  } else if (active) {
    bgColor = "#2ecc71"
  }

  return (
    <div key={step} style={stepWrapper(isMobile)}>

      {index !== 0 && (
        <div
          style={{
            ...line,
            background: active ? "#2ecc71" : "#ddd"
          }}
        />
      )}

      <div
        style={{
          ...circle,
          background: bgColor
        }}
      />

      <span
        style={{
          ...label(isMobile),
          color:
            trackerStep === "declined" && step === "declined"
              ? "#ef4444"
              : trackerStep === "accepted" && step === "accepted"
              ? "#22c55e"
              : active
              ? "#2ecc71"
              : "#999"
        }}
      >
        {step.replace("_", " ")}
      </span>
    </div>
  )
})}
            </div>
            {/* ✅ VISA TRACKER ENTRY */}
{app.status === "accepted" && (
  <div style={visaBox}>
    <p style={{ fontWeight: "600", marginBottom: "10px" }}>
      Your application has been accepted 🎉
    </p>

    <button
      style={visaBtn}
      onClick={() => navigate(`/visa-tracker/${app.id}`)}
      onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"
  e.currentTarget.style.boxShadow = "0 20px 50px rgba(34,197,94,0.5)"
}}

onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0) scale(1)"
  e.currentTarget.style.boxShadow = "0 10px 30px rgba(34,197,94,0.4)"
}}

onMouseDown={e => {
  e.currentTarget.style.transform = "scale(0.96)"
}}

onMouseUp={e => {
  e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"
}}
    >
      Proceed to Next Step
    </button>
  </div>
)}

            {/* PAYMENT SECTION */}
            {shouldShowPayment && (
              <div style={paymentBox}>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>
                  350 CAD Application Processing Fee Required
                </p>

                <button
                  style={payBtn(isMobile)}
                  onClick={() => setSelectedApp(app)}
                  onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"
  e.currentTarget.style.boxShadow = "0 20px 50px rgba(34,197,94,0.5)"
}}

onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0) scale(1)"
  e.currentTarget.style.boxShadow = "0 10px 30px rgba(34,197,94,0.4)"
}}

onMouseDown={e => {
  e.currentTarget.style.transform = "scale(0.96)"
}}

onMouseUp={e => {
  e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"
}}
                >
                  Complete Application Payment
                </button>
              </div>
            )}

            {isPending && (
              <div style={pendingBox}>
                Payment Submitted – Awaiting Verification
              </div>
            )}

            {isVerified && (
              <div style={paidBox}>
                Payment Verified ✓
              </div>
            )}

            {isRejected && (
              <div style={rejectedBox}>
                Payment Rejected – Please try again.
              </div>
            )}

          </div>
        )
      })}

      {/* PAYMENT MODAL */}
      {selectedApp && (
        <PaymentModal
          applicationId={selectedApp.id}
          jobId={selectedApp.job}
          serviceType="application_fee" 
          onSuccess={handlePaymentSuccess}
          onClose={() => setSelectedApp(null)}
        />
      )}
       {/* ================= PAYMENT METHODS ================= */}
      

    </div>
  )
}

export default ApplicationHistory

/* ================= STYLES ================= */


const wrapper = (isMobile) => ({
  maxWidth: "950px",
  margin: isMobile ? "30px auto" : "60px auto",
  padding: isMobile ? "0 12px" : "0 16px",
  position: "relative"
})
const card = (isMobile) => ({
  padding: isMobile ? "16px" : "22px",
  marginBottom: isMobile ? "14px" : "18px",
  borderRadius: "16px",
  position: "relative",
overflow: "hidden",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: isMobile ? "blur(16px)" : "blur(24px)", // 🔥 lighter on mobile

  border: "1px solid rgba(255,255,255,0.5)",
  transition: "all 0.3s ease",

  boxShadow: isMobile
    ? "0 8px 25px rgba(34,197,94,0.08)"
    : `
      0 20px 60px rgba(34,197,94,0.12),
  0 0 80px rgba(34,197,94,0.08),
  inset 0 1px 0 rgba(255,255,255,0.7)
    `
})
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
}
const filterIconBtn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.5)",
  background: "rgba(255,255,255,0.6)",
  color: "#333",
  backdropFilter: "blur(10px)",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500"
}
const filterWrapper = (isMobile) => ({
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  overflowX: "auto", // 🔥 key for mobile
  paddingBottom: "6px"
})
const filterBtn = (isMobile) => ({
  border: "none",
  padding: isMobile ? "8px 14px" : "10px 18px",
  borderRadius: "20px",
  fontSize: isMobile ? "12px" : "13px",
  fontWeight: "500",
  cursor: "pointer",
  whiteSpace: "nowrap", // 🔥 prevents breaking
  transition: "all 0.2s ease",
  backdropFilter: "blur(10px)"
})
const muted = {
  color: "rgba(0,0,0,0.7)",
  margin: "3px 0"
}

const trackerContainer = (isMobile) => ({
  display: "flex",
  marginTop: "20px",
  width: "100%",
  
  alignItems: "center",
  overflowX: "auto",
  paddingBottom: "10px"
})
const sparkle = {
  position: "absolute",
  inset: 0,
  
  pointerEvents: "none",
  background: `
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 1px, transparent 2px),
    radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 1px, transparent 2px),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.2) 1px, transparent 2px)
  `,
  opacity: 0.4
}

const stepWrapper = (isMobile) => ( {
  flex: 1,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  
  minWidth: isMobile ? "70px" : "100px",
} )

const circle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  zIndex: 2
}
const bgGlow = {
  position: "absolute",
  top: "-150px",
  left: "-150px",
  width: "500px",
  height: "500px",
  background: "radial-gradient(circle, rgba(34,197,94,0.6), transparent 70%)",
  filter: "blur(100px)",
  zIndex: 0
}

const line = {
  position: "absolute",
  top: "9px",
  left: "-50%",
  width: "100%",
  height: "3px",
  zIndex: 1
}

const label = (isMobile) => ({
  marginTop: "8px",
  fontSize: isMobile ? "11px" : "13px",
  color: "#333",
  textAlign: "center"
})

const paymentBox = {
  marginTop: "20px",
  padding: "15px",
  
  borderRadius: "8px",
  background: "rgba(255,255,255,0.2)",
border: "1px solid rgba(255,255,255,0.4)"
}

const payBtn = (isMobile) => ({
  width: isMobile ? "100%" : "auto", // 🔥 full width on mobile
  padding: isMobile ? "12px" : "10px 18px",
  fontSize: isMobile ? "14px" : "13px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 10px 30px rgba(34,197,94,0.3)"
})
const pendingBox = {
  marginTop: "15px",
  color: "#f39c12",
  fontWeight: "600"
}

const paidBox = {
  marginTop: "15px",
  color: "#2ecc71",
  fontWeight: "600"
}

const rejectedBox = {
  marginTop: "15px",
  color: "red",
  fontWeight: "600"
}

const methodsWrapper = {
  background: "rgba(255,255,255,0.7)",
  padding: "20px",
  marginBottom: "30px",
  borderRadius: "14px",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
}

const methodsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", // 🔥 smaller
  gap: "12px"
}

const methodCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "18px",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.6)",
  fontSize: "13px",
  fontWeight: "500",
  position: "relative"
}

const recommendedCard = {
  border: "2px solid #2ecc71",
  background: "#f4fff8"
}

const badge = {
  position: "absolute",
  top: "-10px",
  right: "10px",
  background: "#2ecc71",
  color: "white",
  fontSize: "10px",
  padding: "4px 8px",
  borderRadius: "20px",
  fontWeight: "600"
}
const shimmer = {
  position: "absolute",
  top: 0,
  left: "-50%",
  width: "50%",
  height: "100%",
  background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
  animation: "shimmerGlow 6s infinite"
}
const visaBox = {
  marginTop: "20px",
  padding: "15px",
  background: "#eafaf1",
  borderRadius: "8px",
  border: "1px solid #2ecc71"
}

const visaBtn = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: `
  0 10px 30px rgba(34,197,94,0.4),
  0 0 40px rgba(34,197,94,0.25)
`
}