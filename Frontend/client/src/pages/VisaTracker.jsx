import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { createPortal } from "react-dom"
import { Check, CheckCircle, Activity, LifeBuoy, Hourglass } from "lucide-react"
import API from "../api"
import PaymentModal from "../components/PaymentModal"


const STAGES = [
  { key: "job_offer", label: "Job Offer" },
  { key: "work_permit", label: "Work Permit" },
  { key: "ielts", label: "IELTS" },
  { key: "medical", label: "Medical" },
  { key: "biometrics", label: "Biometrics" },
  { key: "lmia", label: "LMIA" },
  { key: "visa_processing", label: "VISA Processing" },
  { key: "decision", label: "Decision" }
]

const STAGE_DOCS = {
  job_offer: "Job Offer Letter",
  work_permit: "Work Permit Document",
  ielts: "IELTS Certificate",
  medical: "Medical Report",
  biometrics: "Biometrics Slip",
  lmia: "LMIA Document"
}

const getProgressStyle = (progress) => {
  if (progress >= 80) {
    return "linear-gradient(90deg, #2ecc71, #27ae60)" // green
  }
  if (progress >= 40) {
    return "linear-gradient(90deg, #f1c40f, #f39c12)" // yellow
  }
  return "linear-gradient(90deg, #e74c3c, #c0392b)" // red
}
const getStageModalContent = (stage) => {
  if (!stage) return {}

  const key = stage.key
  const isCompleted = stage.status === "completed"

  switch (key) {

    case "job_offer":
      return {
        title: "Job Offer Processing",
        message: !stage.uploads?.find(u => u.uploaded_by_admin)
          ? "Your job offer is being prepared."
          : !stage.uploads?.find(u => !u.uploaded_by_admin)
          ? "Your job offer has been issued. Please sign and upload the document."
          : "Your signed document is under review.",
        eta: "1–3 days"
      }

    case "work_permit":
      return {
        title: "Work Permit in Process",
        message:
          "Your work permit application has been submitted and is under review by immigration authorities.",
        eta: "5–10 days"
      }

    case "ielts":
      return {
        title: "IELTS Examination",
        message:
          "Please complete your IELTS exam and upload your results for review.",
        eta: "2–3 days"
      }

    case "medical":
      return {
        title: "Medical Examination",
        message:
          "Your medical examination is pending submission or booking.",
        eta: "3–5 days"
      }

    case "biometrics":
      return {
        title: "Biometrics Appointment",
        message:
          "Please schedule your biometrics appointment.",
        eta: "2–4 days"
      }

    case "lmia":
      const isPaid = stage.lmia_payment_status === "paid"
      const hasCert = stage.uploads?.find(u => u.uploaded_by_admin)

      if (!isPaid) {
        return {
          title: "LMIA Payment Required",
          message:
            "A payment is required to begin LMIA certificate processing.",
          eta: "—"
        }
      }

      if (isPaid && !hasCert) {
        return {
          title: "LMIA Processing",
          message:
            "Your LMIA certificate is being processed.",
          eta: "Up to 14 days"
        }
      }

      return {
        title: "LMIA Certificate Ready",
        message:
          "Your LMIA certificate has been issued and is ready for download.",
        eta: "Completed"
      }

    case "visa_processing":
      const paid = stage.visa_payment_status === "paid"

      if (!paid) {
        return {
          title: "Visa Processing Fee Required",
          message:
            "Please complete your visa processing payment to proceed.",
          eta: "—"
        }
      }

      return {
        title: "Visa Processing in Progress",
        message:
          "Your application is under final review by immigration authorities.",
        eta: "2–5 days"
      }

    case "decision":
      if (!isCompleted) {
        return {
          title: "Final Decision in Progress",
          message:
            "Your visa application is under final review.",
          eta: "2–5 days"
        }
      }

      return {
  title: "Visa Decision Update",
  message:
    stage.decision_status === "approved"
      ? "🎉 Congratulations! Your visa has been approved."
      : "❌ Unfortunately, your application was not successful.",
  eta: "Completed"
}

    default:
      return {
        title: "Processing",
        message: "Your application is in progress.",
        eta: "—"
      }
  }
}
const getCurrentStageStep = (stage) => {
  if (!stage) return { text: "", color: "#999" }

  const adminUpload = stage.uploads?.find(u => u.uploaded_by_admin)
  const userUpload = stage.uploads?.find(u => !u.uploaded_by_admin)
  const isCompleted = stage.status === "completed"

  switch (stage.key) {

    case "job_offer":
      if (!adminUpload) return { text: "⏳ Waiting for job offer", color: "#999" }
      if (adminUpload && !userUpload) return { text: "⏳ Awaiting signature", color: "#f39c12" }
      if (userUpload && !isCompleted) return { text: "⏳ Under review", color: "#f39c12" }
      if (isCompleted) return { text: "✔ Reviewed & approved", color: "#2ecc71" }
      break

    case "work_permit":
      return isCompleted
        ? { text: "✔ Work permit approved", color: "#2ecc71" }
        : { text: "⏳ Under review by immigration authorities", color: "#f39c12" }

    case "ielts":
      if (!userUpload) return { text: "⏳ Awaiting IELTS results upload", color: "#999" }
      if (userUpload && !adminUpload) return { text: "⏳ Results under review", color: "#f39c12" }
      if (adminUpload) return { text: "✔ IELTS certificate ready", color: "#2ecc71" }
      break

    case "medical":
      if (isCompleted) return { text: "✔ Medical approved", color: "#2ecc71" }
      if (userUpload) return { text: "⏳ Medical report under review", color: "#f39c12" }
      if (stage.medical_booking_date) return { text: "⏳ Appointment requested", color: "#f39c12" }
      return { text: "⏳ Awaiting medical submission or booking", color: "#999" }

    case "biometrics":
  if (stage.status === "completed") {
    return { text: "✔ Appointment confirmed", color: "#2ecc71" }
  }

  if (!stage.biometrics_booking_date) {
    return { text: "⏳ Awaiting booking", color: "#999" }
  }

  if (stage.biometrics_status === "pending") {
    return { text: "⏳ Awaiting approval", color: "#f39c12" }
  }

  if (stage.biometrics_status === "approved") {
    return { text: "✔ Appointment approved", color: "#2ecc71" }
  }

  if (stage.biometrics_status === "rejected") {
    return { text: "❌ Appointment rejected", color: "#e74c3c" }
  }
      break

    case "lmia":
      const isPaid = stage.lmia_payment_status === "paid"
      
      if (!isPaid) return { text: "⏳ Awaiting payment", color: "#999" }
      if (isPaid && !adminUpload) return { text: "⏳ Processing certificate", color: "#f39c12" }
      if (adminUpload) return { text: "✔ Certificate issued", color: "#2ecc71" }
      break

    case "visa_processing":
      const paid = stage.visa_payment_status === "paid"
      if (!paid) return { text: "⏳ Awaiting payment", color: "#999" }
      if (paid && !isCompleted) return { text: "⏳ Processing visa application", color: "#f39c12" }
      if (isCompleted) return { text: "✔ Processing completed", color: "#2ecc71" }
      break

    case "decision":
      if (!isCompleted) return { text: "⏳ Awaiting final decision", color: "#f39c12" }
      if (stage.decision_status === "approved") return { text: "✔ Visa approved", color: "#2ecc71" }
      if (stage.decision_status === "rejected") return { text: "❌ Visa rejected", color: "#e74c3c" }
      break
  }

  return { text: "Processing...", color: "#999" }
}

// ✅ UNIVERSAL STAGE PROGRESS CALCULATOR
// ✅ STAGE-AWARE PROGRESS CALCULATOR
const calculateStageProgress = (stage) => {
  if (!stage) return 0

  const adminUpload = stage.uploads?.find(u => u.uploaded_by_admin)
  const userUpload = stage.uploads?.find(u => !u.uploaded_by_admin)

  switch (stage.key) {

    // =========================
    case "job_offer":
      if (!adminUpload) return 0
      if (adminUpload && !userUpload) return 50
      if (adminUpload && userUpload && stage.status !== "completed") return 80
      if (stage.status === "completed") return 100
      return 0

    // =========================
    case "work_permit":
      return stage.status === "completed" ? 100 : 60

    // =========================
    case "ielts":
      if (!userUpload) return 20
      if (userUpload && !adminUpload) return 60
      if (adminUpload) return 100
      return 0

    // =========================
    case "medical":
  const hasBooking = stage.medical_booking_date

  // ✅ ALWAYS check completion FIRST
  if (stage.status === "completed") return 100

  if (!userUpload && !hasBooking) return 20
  if (userUpload || hasBooking) return 70

  return 0

    // =========================
    case "biometrics": {
  const date = stage.biometrics_booking_date
  const status = stage.biometrics_status

  // ✅ ALWAYS check completion FIRST
  if (stage.status === "completed") return 100

  if (!date) return 20

  if (date && status === "pending") return 60

  if (status === "approved") return 100

  if (status === "rejected") return 40

  return 0
}

    // =========================
    case "lmia": {
  const isPaid = stage.lmia_payment_status === "paid"

  if (stage.status === "completed") return 100
  if (isPaid) return 70
  return 30
}

case "visa_processing": {
  const isPaid = stage.visa_payment_status === "paid"

  if (stage.status === "completed") return 100
  if (isPaid) return 80
  return 50
}

    // =========================
    case "decision":
      return stage.status === "completed" ? 100 : 90

    default:
      return 0
  }
}

// ✅ OVERALL PROGRESS (timeline based)
const calculateOverallProgress = (currentIndex) => {
  return Math.round((currentIndex / (STAGES.length - 1)) * 100)
}

function VisaTracker() {
  const { applicationId } = useParams()
  const [visa, setVisa] = useState(null)
  const [loading, setLoading] = useState(true)
  const modalRef = useRef(null)
const [modalTop, setModalTop] = useState(0)
const [modalDirection, setModalDirection] = useState("top")
const [modalLeft, setModalLeft] = useState(0)
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })

  const [file, setFile] = useState(null)
  const [selectedStage, setSelectedStage] = useState(null)
  const [bookingDate, setBookingDate] = useState("")
  const [settings, setSettings] = useState(null)
  const circleRefs = useRef([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showStageModal, setShowStageModal] = useState(false)
  const [showWorkPermitModal, setShowWorkPermitModal] = useState(false)
  const [showIELTSModal, setShowIELTSModal] = useState(false)
  const [showMedicalModal, setShowMedicalModal] = useState(false)
  const [showBiometricsModal, setShowBiometricsModal] = useState(false)
  const [showLMIAModal, setShowLMIAModal] = useState(false)
  const [showVisaProcessingModal, setShowVisaProcessingModal] = useState(false)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

    /* 🎨 STYLES */
const styles = {
  container: {
  maxWidth: "1200px",
  padding: isMobile ? "15px" : "30px",
margin: isMobile ? "10px" : "40px auto",
  backdropFilter: "blur(20px)",
  fontFamily: "Segoe UI, sans-serif",
  borderRadius: "20px",
  position: "relative",
  overflow: "visible",
  background: `
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4), transparent 40%),
    linear-gradient(135deg, #e6eef8, #d6e4f5, #cfdff3)
  `,

  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  zIndex: 9999,
},
backgroundShimmer: isMobile ? {} : {
  position: "absolute",
  top: 0,
  left: "-50%",
  width: "200%",
  height: "100%",
  background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent)",
  animation: "backgroundShimmer 6s infinite",
  pointerEvents: "none"
},
  title: { fontSize: "28px", fontWeight: "600", color: "#2c3e50" },
  subtitle: { color: "#7f8c8d", marginBottom: "25px" },
  loading: { padding: "20px" },
  highlightCard: { background: "linear-gradient(135deg, #fff7d6, #fceabb)", padding: "18px", borderRadius: "12px", marginBottom: "30px", borderLeft: "6px solid #f1c40f", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" },
timelineWrapper: {
  position: "relative",
  display: "flex",
  justifyContent: isMobile ? "flex-start" : "space-between",
  marginBottom: "120px",
  padding: "0 10px",
  overflowX: "hidden",
},
progressMini: {
  width: "100%",
  height: "5px",
  background: "#eee",
  borderRadius: "4px",
  overflow: "hidden"
},

progressMiniFill: {
  height: "100%",
  background: "linear-gradient(90deg, #f1c40f, #f39c12)",
  transition: "width 0.4s ease"
},

progressBackground: {
  position: "absolute",
  top: "14px",
  left: "20px",
  right: "20px",
  height: "6px",
  background: "linear-gradient(90deg, #ddd, #eee)",
  borderRadius: "10px",
  zIndex: 0
},

progressFill: {
  position: "absolute",
  top: "12px",
  left: "20px",
  height: "6px",
  
transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  borderRadius: "10px",
  boxShadow: "0 0 12px rgba(241,196,15,0.6)",
  zIndex: 1
},
downloadSection: {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
  flexWrap: "wrap", // wraps on small screens
  justifyContent: "center"
},

downloadCard: {
  padding: "12px 18px",
  borderRadius: "12px",

  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  border: "1px solid rgba(0,0,0,0.08)",

  fontWeight: "600",
  fontSize: "13px",
  color: "#2c3e50",
  textDecoration: "none",

  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  transition: "all 0.25s ease"
},
docRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "14px 16px",
  marginBottom: "10px",

  borderRadius: "12px",
  background: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(0,0,0,0.05)",

  transition: "all 0.25s ease",
},

docInfo: {
  display: "flex",
  flexDirection: "column"
},

docTitle: {
  fontWeight: "600",
  fontSize: "14px",
  color: "#2c3e50",
  margin: 0
},

docSub: {
  fontSize: "12px",
  color: "#888",
  marginTop: "3px"
},

docActions: {
  display: "flex",
  gap: "10px"
},

downloadBtn: {
  padding: "8px 12px",
  borderRadius: "8px",

  background: "linear-gradient(135deg, #3498db, #2b6cb0)",
  color: "#fff",
  textDecoration: "none",

  fontSize: "12px",
  fontWeight: "600",

  boxShadow: "0 4px 12px rgba(52,152,219,0.3)",
  transition: "all 0.2s ease"
},

noDoc: {
  fontSize: "12px",
  color: "#bbb"
},
cardTitle: {
  fontSize: "16px",
  fontWeight: "700",
  color: "#2c3e50",
  marginBottom: "10px",
  letterSpacing: "0.3px"
},
  step: { textAlign: "center", zIndex: 2 },
  circle: {
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  margin: "0 auto",

  display: "flex",              // ✅ center icon
  alignItems: "center",        // ✅ vertical center
  justifyContent: "center",    // ✅ horizontal center

  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease"
},
  stepLabel: { fontSize: isMobile ? "10px" : "12px", whiteSpace: "nowrap", marginTop: "8px", color: "#555" },
  grid: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" },
  card: {
  background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
  backdropFilter: "blur(12px)",
  padding: isMobile ? "14px" : "20px",
  borderRadius: "16px",
  boxSizing: "border-box", 
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",

  cursor: "pointer",
},
cardHeaderGold: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "600",
  marginBottom: "12px",
  padding: "8px 10px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #f1c40f, #f39c12)",
  color: "#fff",
  fontSize: "13px"
},

cardHeaderBlue: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "600",
  marginBottom: "12px",
  padding: "8px 10px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #3498db, #2b6cb0)",
  color: "#fff",
  fontSize: "13px"
},

cardHeaderGreen: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "600",
  marginBottom: "12px",
  padding: "8px 10px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #2ecc71, #27ae60)",
  color: "#fff",
  fontSize: "13px"
},
  primaryBtn: {
  marginTop: "12px",
  padding: "10px 14px",
  background: "linear-gradient(135deg, #2b6cb0, #1e3c72)",
  color: "#fff",
  border: "none",
  width: isMobile ? "100%" : "auto",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
},
heroCard: {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  background: "linear-gradient(135deg, #fff7d6, #fceabb)",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "30px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
},

heroLeft: {
  fontSize: "40px"
},

heroContent: {
  flex: 1
},

heroTitle: {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#2c3e50"
},

heroText: {
  margin: "5px 0",
  color: "#555"
},

heroSub: {
  fontSize: "13px",
  color: "#777"
},

heroProgress: {
  marginTop: "10px",
  height: "8px",
  background: "#eee",
  borderRadius: "6px",
  overflow: "hidden"
},

heroProgressFill: {
  height: "100%",
  background: "linear-gradient(90deg, #f1c40f, #f39c12)"
},

heroPercent: {
  marginTop: "5px",
  fontSize: "12px",
  color: "#555"
},
  link: { display: "block", marginTop: "8px", padding: "8px", background: "#f8f9fa", borderRadius: "6px", textDecoration: "none", color: "#2c3e50" },
  docGroup: { marginBottom: "15px" }
}
const modalStyles = {
  overlay: {
  position: "fixed", // 🔥 important (not absolute)
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "auto",
  inset: 0,
  zIndex: 10000
},

 modal: {
  position: "absolute",
  transform: "none",
  pointerEvents: "auto",
 
  background: "linear-gradient(135deg, #fff7d6, #fceabb)",
  padding: "18px 22px",
  borderRadius: "14px",
  width: isMobile ? "90%" : "360px",
  left: isMobile ? "5%" : modalLeft,
  top: modalTop,
  zIndex: 9999,

  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  border: "1px solid rgba(241,196,15,0.4)"
},
arrow: {
  position: "absolute",
  bottom: "-7px",
  left: "50%",
  transform: "translateX(-50%) rotate(45deg)",
  width: "14px",
  height: "14px",
  background: "#fceabb",
  borderRight: "1px solid rgba(241,196,15,0.4)",
  borderBottom: "1px solid rgba(241,196,15,0.4)"
},
  

progressBar: {
  width: "100%",
  height: "14px",
  background: "rgba(0,0,0,0.08)",
  borderRadius: "999px",
  overflow: "hidden",
  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)"
},

progressFill: {
  height: "100%",
  background: "linear-gradient(90deg, #f6d365, #f39c12, #f1c40f)",
  borderRadius: "999px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "8px",

  boxShadow: `
    0 0 10px rgba(241,196,15,0.6),
    inset 0 0 6px rgba(255,255,255,0.6)
  `,

  transition: "width 0.5s ease"
},

progressLabel: {
  fontSize: "10px",
  fontWeight: "600",
  color: "#2c3e50",
  background: "rgba(255,255,255,0.7)",
  padding: "2px 6px",
  borderRadius: "6px",
  backdropFilter: "blur(4px)"
},
shimmer: isMobile ? { display: "none" } : {
  position: "absolute",
  top: 0,
  left: "-40%",
  width: "40%",
  height: "100%",
  background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.7), transparent)",
  animation: "shimmer 2s infinite"
},
headerRow: {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "10px"
},

iconContainer: {
  width: "25%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
},

textContainer: {
  width: "75%"
},

title: {
  margin: 0,
  fontSize: "15px",
  fontWeight: "700",
  color: "#2c3e50"
},

message: {
  marginTop: "6px",
  fontSize: "13px",
  color: "#555",
  lineHeight: "1.4"
}
  
}
const spinStyle = {
  animation: "spin 2s linear infinite"
}
const hourglassStyle = {
  animation: "hourglassRotate 2.5s ease-in-out infinite",
  filter: "drop-shadow(0 0 6px rgba(241,196,15,0.6))"
}


useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])
  
  
  useEffect(() => {
    if (applicationId) fetchVisa()
  }, [applicationId])
useEffect(() => {
  fetchSettings()
}, [])
useEffect(() => {
  const style = document.createElement("style")
  style.innerHTML = `
    @keyframes backgroundShimmer {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(50%); }
    }
      @keyframes shimmer {
  0% { left: -40%; }
  100% { left: 120%; }
}
  @keyframes hourglassRotate {
    0%   { transform: rotate(0deg); }
    40%  { transform: rotate(180deg); }
    60%  { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }
  `
  
  document.head.appendChild(style)
}, [])
useEffect(() => {
  const handleScroll = () => {
    if (!selectedStage) return

    const index = STAGES.findIndex(s => s.key === selectedStage)
    const circle = circleRefs.current[index]

    if (!circle) return

    const rect = circle.getBoundingClientRect()

    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY
    })
  }

  // window.addEventListener("scroll", handleScroll)

  return () => window.removeEventListener("scroll", handleScroll)
}, [selectedStage])
useEffect(() => {
  if (modalRef.current) {
    const rect = modalRef.current.getBoundingClientRect()

    const spacing = 12
    let top = modalPosition.y - rect.height - spacing
    let direction = "top"

    // 🔥 FLIP IF NOT ENOUGH SPACE ABOVE
    if (top < 20) {
      top = modalPosition.y + spacing
      direction = "bottom"
    }

    // 🔥 HORIZONTAL CLAMP
    let left = modalPosition.x - rect.width / 2

    if (left < 10) left = 10
    if (left + rect.width > window.innerWidth - 10) {
      left = window.innerWidth - rect.width - 10
    }

    setModalTop(top)
    setModalLeft(left)
    setModalDirection(direction)
  }
}, [modalPosition, showStageModal, showWorkPermitModal,
    showIELTSModal, showMedicalModal, showBiometricsModal,
    showLMIAModal, showVisaProcessingModal, showDecisionModal])

  const fetchVisa = async () => {
    try {
      const res = await API.get(`visa-applications/?application_id=${applicationId}`)
      const data = res.data.results || res.data
      setVisa(data[0] || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDecisionUpdate = async (decision) => {
    if (!activeStageData) return
    try {
      await API.patch(`visa-stage/${activeStageData.id}/update/`, {
        decision_status: decision
      })
      setVisa(prev => ({
        ...prev,
        stages: prev.stages.map(s =>
          s.id === activeStageData.id
            ? { ...s, status: "completed", decision_status: decision, notes: decision === "approved" ? "✅ Visa Approved" : "❌ Visa Rejected" }
            : s
        ),
        current_stage: activeStageData.key
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (stageId) => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("stage", stageId)
    try {
      await API.post("visa-upload/", formData)
      setFile(null)
      fetchVisa()
    } catch (err) {
      console.error(err)
    }
  }
  const fetchSettings = async () => {
  try {
    const res = await API.get("site-settings/")
    setSettings(res.data)
  } catch (err) {
    console.error("Failed to load settings")
  }
}

const MODAL_WIDTH = 360
const top = modalTop
const left = modalLeft
const arrowOffset = Math.min(
  Math.max(modalPosition.x - left, 20),
  MODAL_WIDTH - 20
)
  const decisionStage = visa?.stages?.find(s => s.key === "decision")

  let currentIndex = STAGES.findIndex(s => s.key === visa?.current_stage)
if (decisionStage?.status === "completed") {
  currentIndex = STAGES.length - 1
}
  const activeStageKey = selectedStage && STAGES.findIndex(s => s.key === selectedStage) <= currentIndex
    ? selectedStage
    : visa?.current_stage
  const activeStageData = visa?.stages.find(s => s.key === activeStageKey)
  const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin)
const userUpload = activeStageData?.uploads?.find(u => !u.uploaded_by_admin)

const isReviewed = activeStageData?.status === "completed"



const stageProgress = calculateStageProgress(activeStageData)
const overallProgress = calculateOverallProgress(currentIndex)

// if (adminUpload) progress = 33
// if (adminUpload && userUpload) progress = 66
// if (adminUpload && userUpload && isReviewed) progress = 100
  const minDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
const modalContent = getStageModalContent(activeStageData)
  const handleMedicalBooking = async () => {
    if (!bookingDate || !activeStageData) return
    try {
      await API.patch(`visa-stage/${activeStageData.id}/update/`, { medical_booking_date: bookingDate })
      setVisa(prev => ({
        ...prev,
        stages: prev.stages.map(s =>
          s.id === activeStageData.id ? { ...s, medical_booking_date: bookingDate } : s
        )
      }))
      setBookingDate("")
    } catch (err) { console.error(err) }
  }

  const handleBiometricsBooking = async () => {
    if (!bookingDate || !activeStageData) return
    try {
      await API.patch(`visa-stage/${activeStageData.id}/update/`, {
        biometrics_booking_date: bookingDate,
        biometrics_status: "pending"
      })
      setVisa(prev => ({
        ...prev,
        stages: prev.stages.map(s =>
          s.id === activeStageData.id
            ? { ...s, biometrics_booking_date: bookingDate, biometrics_status: "pending" }
            : s
        )
      }))
      setBookingDate("")
    } catch (err) { console.error(err) }
  }
  const getServiceType = (stageKey) => {
  switch (stageKey) {
    case "lmia":
      return "lmia_fee"
    case "visa_processing":
      return "visa_fee"
    default:
      return "application_fee"
  }
}

  if (loading) return <p style={styles.loading}>Loading...</p>
  if (!visa) return <p style={styles.loading}>No visa data</p>

  return (
    <div style={styles.container}>
      <div style={styles.backgroundShimmer} />
      <h2 style={styles.title}>Visa Application Tracking</h2>
      <p style={styles.subtitle}>Track your visa processing progress</p>
      

      {/* Timeline */}
      <div style={styles.timelineWrapper}>
        <div style={styles.progressBackground} />
        <div
  style={{
    ...styles.progressFill,
    width: `${overallProgress}%`
     ,
    background: getProgressStyle(overallProgress)
  }}
/>
        <div style={modalStyles.shimmer} />
        {STAGES.map((stage, index) => {
  const stageData = visa.stages.find(s => s.key === stage.key)
  const isCompleted = stageData?.status === "completed"
  const isCurrent = !isCompleted && stage.key === visa?.current_stage
  const isLocked = index > currentIndex
  

  return (
    <div
      key={stage.key}
      style={{
  ...styles.step,
  cursor: isLocked ? "not-allowed" : "pointer",
  opacity: isLocked ? 0.5 : 1
}}
      onClick={(e) => {
  // 🚫 Block future stages completely
  if (index > currentIndex) return

  // ✅ Only past + current allowed
  setSelectedStage(stage.key)
const circle = circleRefs.current[index]

if (!circle) return

const rect = circle.getBoundingClientRect()

setModalPosition({
  x: rect.left + rect.width / 2,
  y: rect.top + window.scrollY// 🔥 THIS is the key fix
})


  // ✅ Open ONLY for allowed stages
  if (stage.key === "job_offer") setShowStageModal(true)
  if (stage.key === "work_permit") setShowWorkPermitModal(true)
  if (stage.key === "ielts") setShowIELTSModal(true)
  if (stage.key === "medical") setShowMedicalModal(true)
  if (stage.key === "biometrics") setShowBiometricsModal(true)
  if (stage.key === "lmia") setShowLMIAModal(true)
  if (stage.key === "visa_processing") setShowVisaProcessingModal(true)
  if (stage.key === "decision") setShowDecisionModal(true)
}} >
      <div
      ref={(el) => (circleRefs.current[index] = el)} 
  style={{
    ...styles.circle,
    background: isCompleted
      ? "linear-gradient(135deg, #27ae60, #2ecc71)"
      : isCurrent
      ? "linear-gradient(135deg, #f1c40f, #f39c12)"
      : "#e0e0e0",

    boxShadow: isCurrent
      ? "0 0 15px rgba(241,196,15,0.9)"
      : isCompleted
      ? "0 0 10px rgba(46,204,113,0.6)"
      : "none",

    transform: isCurrent ? "scale(1.3)" : "scale(1)",
  }}
>
  {isCompleted ? (
  <Check size={16} color="#fff" strokeWidth={3} />
) : (
  <span style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>
    {index + 1}
  </span>
)}
</div>
      
      <span style={styles.stepLabel}>{stage.label}</span>
      
    </div>
  )
})}
      </div>
       {/* MODAL */}
      {/* ========================= */}
      {showStageModal && createPortal (
  <div style={modalStyles.overlay} onClick={() => setShowStageModal(false)}>
    <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
    top: modalTop, // 
    left: modalLeft,
transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

      <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
        
          width: `${stageProgress}%`, 

    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>
      

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      <button onClick={() => setShowStageModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
{showWorkPermitModal && createPortal(
  <div style={modalStyles.overlay} onClick={() => setShowWorkPermitModal(false)}>
    <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
     top: modalTop, // 
    left: modalLeft,
transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

     <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
        width: `${stageProgress}%`, 
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      

      <button onClick={() => setShowWorkPermitModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
{showIELTSModal && createPortal(
  <div style={modalStyles.overlay} onClick={() => setShowIELTSModal(false)}>
   <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
     top: modalTop, // 
    left: modalLeft,
    transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

      <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
         width: `${stageProgress}%`, 
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      <button onClick={() => setShowIELTSModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
{showMedicalModal && createPortal(
  <div style={modalStyles.overlay} onClick={() => setShowMedicalModal(false)}>
    <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
    top: modalTop, // 
    left: modalLeft,
transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

      <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
         width: `${stageProgress}%`, 
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      <button onClick={() => setShowMedicalModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
{showBiometricsModal && createPortal (
  <div style={modalStyles.overlay} onClick={() => setShowBiometricsModal(false)}>
    <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
     top: modalTop, // 
    left: modalLeft,
    transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>     
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

      <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
                
         width: `${stageProgress}%`, 
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      <button onClick={() => setShowBiometricsModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
  
)}
{showPaymentModal && (
  <PaymentModal
    applicationId={applicationId}
    jobId={visa?.job}
    serviceType={getServiceType(activeStageData?.key)}
    stageId={activeStageData?.id}
    onClose={() => setShowPaymentModal(false)}
    onSuccess={() => {
      fetchVisa() // 🔥 refresh UI
    }}
  />
)}
{showLMIAModal && createPortal(
  <div style={modalStyles.overlay} onClick={() => setShowLMIAModal(false)}>
    <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
     top: modalTop, // 
    left: modalLeft,
transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

      <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
                 
         width: `${stageProgress}%`,
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      <button onClick={() => setShowLMIAModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
{showVisaProcessingModal && createPortal(
  <div style={modalStyles.overlay} onClick={() => setShowVisaProcessingModal(false)}>
    <div
    ref={modalRef}
  style={{
    ...modalStyles.modal,
     top: modalTop, // 
    left: modalLeft,
transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      
     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

     <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
         width: `${stageProgress}%`,
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>

{(() => {
  const step = getCurrentStageStep(activeStageData)
  return (
    <p style={{
      color: step.color,
      fontWeight: "500",
      marginTop: "10px"
    }}>
      {step.text}
    </p>
  )
})()}

      <button onClick={() => setShowVisaProcessingModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
{showDecisionModal && createPortal(
  <div style={modalStyles.overlay} onClick={() => setShowDecisionModal(false)}>
   <div
  ref={modalRef}
  style={{
    ...modalStyles.modal,
    
top: modalTop, // 
    left: modalLeft,
transform: "none"
  }}
  onClick={(e) => e.stopPropagation()}
>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Hourglass size={28} color="#f39c12" style={hourglassStyle} />
  <h3 style={{
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
    fontWeight: "700",
    color: "#2c3e50"
  }}>
    {modalContent.title}
  </h3>
</div>

      <div style={modalStyles.progressWrapper}>
  <div style={modalStyles.progressBar}>
    <div
      style={{
        ...modalStyles.progressFill,
         width: `${stageProgress}%`, 
    background: getProgressStyle(stageProgress)
      }}
    >
      <span style={modalStyles.progressLabel}>
        {stageProgress}% Complete
      </span>
      <div style={modalStyles.shimmer} />
    </div>
  </div>
</div>
      {activeStageData?.status !== "completed" ? (
        <>
          <ul>
            <li style={{ color: "#2ecc71" }}>✔ Application submitted</li>
            <li style={{ color: "#2ecc71" }}>✔ Processing completed</li>
            <li style={{ color: "#f39c12" }}>⏳ Awaiting final decision</li>
          </ul>
        </>
      ) : (
        <>
          <h2 style={{ 
            color: activeStageData?.notes?.includes("Approved") ? "#2ecc71" : "#e74c3c",
            textAlign: "center"
          }}>
            {activeStageData?.notes}
          </h2>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#555" }}>
            Thank you for your patience throughout the process.
          </p>
        </>
      )}

      <button onClick={() => setShowDecisionModal(false)}>Close</button>
      <div
  style={{
    ...modalStyles.arrow,
    left: arrowOffset,
    top: modalDirection === "bottom" ? "-6px" : "auto",
    bottom: modalDirection === "top" ? "-6px" : "auto",
  }}
/>
    </div>
  </div>,
  document.body
)}
      {/* Action Grid */}
      <div style={styles.grid}>
        <div
  style={{
    ...styles.card,
    transform: hoveredCard === "action" ? "scale(1.03)" : "scale(1)",
    boxShadow:
      hoveredCard === "action"
        ? "0 15px 40px rgba(241,196,15,0.25)"
        : "0 8px 25px rgba(0,0,0,0.08)"
  }}
  onMouseEnter={() => setHoveredCard("action")}
  onMouseLeave={() => setHoveredCard(null)}
>
  <div style={styles.cardHeaderGold}>
    <CheckCircle size={18} />
    <span>Action Required</span>
  </div>
          {activeStageData?.status !== "completed" ? (
            <>
            {activeStageKey === "job_offer" ? (
  <>
    {(() => {
      const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin === true)
      const userUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin === false)

      // =============================
      // CASE 1: No admin document
      // =============================
      if (!adminUpload) {
        return (
          <p style={{ color: "#888" }}>
            No action required at this stage.
          </p>
        )
      }

      // =============================
      // CASE 2: Admin uploaded, user NOT signed
      // =============================
      if (adminUpload && !userUpload) {
        return (
          <>
            <p style={{ fontWeight: "600", color: "#f39c12" }}>
              📄 Job Offer Letter Issued – Signature Required
            </p>

            <p style={{ fontSize: "13px", color: "#555", marginBottom: "10px" }}>
              We are pleased to inform you that your job offer letter has been issued.<br />
              Please carefully review, sign, and upload the signed copy within <strong>3 days</strong>.
            </p>

            <a
              href={adminUpload.file}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Download Job Offer Letter
            </a>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <button
              style={styles.primaryBtn}
              onClick={() => handleUpload(activeStageData?.id)}
            >
              Upload Signed Document
            </button>
          </>
        )
      }

      // =============================
      // CASE 3: User uploaded signed doc
      // =============================
      if (userUpload) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✅ Signed document submitted successfully
            </p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Under review – no action required.
            </p>
          </>
        )
      }
    })()}
  </>
  
)  : activeStageKey === "work_permit" ? (
  <>
    <p style={{ color: "#2ecc71", fontWeight: "600" }}>
      ✓ No Action Required
    </p>
    <p style={{ fontSize: "13px", color: "#555" }}>
      Your work permit application is currently being processed by immigration authorities.
      Our team is actively monitoring the progress on your behalf.
    </p>
  </>)
: activeStageKey === "lmia" ? (
  <>
    {(() => {
      const isPaid = activeStageData?.lmia_payment_status === "paid"
      const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin)

      // ✅ CASE 1: NOT PROCESSED (NO CERTIFICATE)
      if (!isPaid) {
        return (
          <>
            <p style={{ fontWeight: "600", color: "#f39c12" }}>
              💳 LMIA Certificate Processing Fee Required
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              To continue with your LMIA-sponsored application, please complete the LMIA processing payment of <strong>$815</strong>.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Once payment is confirmed, our team will process your LMIA certificate within 14 days.
            </p>

            <button style={styles.primaryBtn}
            onClick={() => setShowPaymentModal(true)}>
              Proceed to Payment
            </button>
          </>
        )
      }
      if (isPaid && !adminUpload) {
  return (
    <>
      <p style={{ color: "#2ecc71", fontWeight: "600" }}>
        ✓ Payment Received
      </p>
      <p style={{ fontSize: "13px", color: "#555" }}>
        Your LMIA certificate is being processed (up to 14 days).
      </p>
    </>
  )
}

      // ✅ CASE 2: CERTIFICATE AVAILABLE
      if (adminUpload) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              📄 LMIA Certificate Available
            </p>

            <a
              href={adminUpload.file}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Download LMIA Certificate
            </a>
          </>
        )
      }
    })()}
  </>
) : activeStageKey === "ielts" ? (
  <>
    {(() => {
      const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin)
      const userUpload = activeStageData?.uploads?.find(u => !u.uploaded_by_admin)

      // ✅ CASE 1: Nothing uploaded
      if (!userUpload && !adminUpload) {
        return (
          <>
            <p style={{ fontWeight: "600", color: "#f39c12" }}>
              📘 Complete IELTS Examination
            </p>

            <ul style={{ fontSize: "13px", color: "#555" }}>
              <li>Take your IELTS test</li>
              <li>Upload your IELTS results after completion</li>
            </ul>

            <p style={{ fontSize: "12px", color: "#888" }}>
              Deadline: Within 3 days
            </p>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button style={styles.primaryBtn} onClick={() => handleUpload(activeStageData?.id)}>
              Upload IELTS Results
            </button>
          </>
        )
      }

      // ✅ CASE 2: User uploaded
      if (userUpload && !adminUpload) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✓ Results Submitted
            </p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Under review – no action required.
            </p>
          </>
        )
      }

      // ✅ CASE 3: Admin uploaded certificate
      if (adminUpload) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              🎓 IELTS Certificate Available
            </p>

            <a href={adminUpload.file} target="_blank" rel="noopener noreferrer" style={styles.link}>
              Download IELTS Certificate
            </a>
          </>
        )
      }
    })()}
  </>
): activeStageKey === "medical" ? (
  <>
    {(() => {
      const userUpload = activeStageData?.uploads?.find(u => !u.uploaded_by_admin)
      const hasBooking = activeStageData?.medical_booking_date

      // ✅ CASE 1: NOTHING DONE
      if (!userUpload && !hasBooking) {
        return (
          <>
            <p style={{ fontWeight: "600", color: "#f39c12" }}>
              🏥 Medical Examination Required
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Option 1: Upload your medical report if already completed
            </p>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button style={styles.primaryBtn} onClick={() => handleUpload(activeStageData?.id)}>
              Upload Medical Results
            </button>

            <p style={{ margin: "10px 0", fontSize: "12px", color: "#888" }}>OR</p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Option 2: Book a medical examination
            </p>

            <input
              type="date"
              value={bookingDate}
              min={minDate}
              onChange={e => setBookingDate(e.target.value)}
            />

            <button
              style={{ ...styles.primaryBtn, background: "#f39c12" }}
              onClick={handleMedicalBooking}
            >
              Book Medical Appointment
            </button>
          </>
        )
      }

      // ✅ CASE 2: USER UPLOADED
      if (userUpload) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✓ Medical Report Submitted
            </p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              No action required.
            </p>
          </>
        )
      }

      // ✅ CASE 3: BOOKED DATE
      if (hasBooking) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✓ Appointment Request Submitted
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Your preferred date: <strong>{activeStageData.medical_booking_date}</strong>
            </p>
          </>
        )
      }
    })()}
  </>
) : activeStageKey === "biometrics" ? (
  <>
    {(() => {
      const status = activeStageData?.biometrics_status
      const date = activeStageData?.biometrics_booking_date

      // ✅ CASE 1: NOT BOOKED
      if (!date) {
        return (
          <>
            <p style={{ fontWeight: "600", color: "#f39c12" }}>
              📅 Book Biometrics Appointment
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Select a preferred date from available options.
            </p>

            <input
              type="date"
              value={bookingDate}
              min={minDate}
              onChange={e => setBookingDate(e.target.value)}
            />

            <button style={styles.primaryBtn} onClick={handleBiometricsBooking}>
              Book Biometrics
            </button>
          </>
        )
      }

      // ✅ CASE 2: BOOKED → PENDING
      if (date && status === "pending") {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✓ Appointment Request Submitted
            </p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Waiting for admin approval.
            </p>
          </>
        )
      }

      // ✅ CASE 3: APPROVED
      if (status === "approved") {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✅ Biometrics Appointment Approved
            </p>
            <p>
              Scheduled for: <strong>{date}</strong>
            </p>
          </>
        )
      }

      // ✅ CASE 4: REJECTED
      if (status === "rejected") {
        return (
          <>
            <p style={{ color: "#e74c3c", fontWeight: "600" }}>
              ❌ Appointment Rejected
            </p>

            <p>Please select a new date.</p>

            <input
              type="date"
              value={bookingDate}
              min={minDate}
              onChange={e => setBookingDate(e.target.value)}
            />

            <button style={styles.primaryBtn} onClick={handleBiometricsBooking}>
              Rebook Biometrics
            </button>
          </>
        )
      }
    })()}
  </>
)
: activeStageKey === "visa_processing" ? (
  <>
    {(() => {
      const isPaid = activeStageData?.visa_payment_status === "paid"

      // =========================
      // CASE 1: NOT PAID
      // =========================
      if (!isPaid) {
        return (
          <>
            <p style={{ fontWeight: "600", color: "#f39c12" }}>
              💳 Visa Processing Fee Required
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Please complete the visa processing payment of <strong>$1,105</strong> to proceed.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              After payment is successfully confirmed, your application will be submitted for visa processing.  
No additional documents are required.

            </p>

            <button
              style={styles.primaryBtn}
              onClick={() => setShowPaymentModal(true)}
            >
              Proceed to Payment
            </button>
          </>
        )
      }

      // =========================
      // CASE 2: PAID
      // =========================
      if (isPaid) {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              ✓ Payment Received
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Your visa processing fee has been successfully received.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Your application has been submitted and is currently under processing.
              No action is required at this stage.
            </p>
          </>
        )
      }
    })()}
  </>
) : activeStageKey === "decision" ? (
  <>
    {(() => {
      const status = activeStageData?.status
      const decision = activeStageData?.decision_status

      // =========================
      // CASE 1: PENDING
      // =========================
      if (status !== "completed") {
        return (
          <>
            <p style={{ color: "#f39c12", fontWeight: "600" }}>
              ⏳ Decision Pending
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Your application is in the final stage of review.  
              Please wait while immigration authorities finalize the decision.
            </p>
          </>
        )
      }

      // =========================
      // CASE 2: APPROVED
      // =========================
      if (status === "completed" && decision === "approved") {
        return (
          <>
            <p style={{ color: "#2ecc71", fontWeight: "600" }}>
              🎉 Visa Approved
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Congratulations! Your visa application has been approved.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              You will receive further instructions regarding travel and next steps.
            </p>
          </>
        )
      }

      // =========================
      // CASE 3: REJECTED
      // =========================
      if (status === "completed" && decision === "rejected") {
        return (
          <>
            <p style={{ color: "#e74c3c", fontWeight: "600" }}>
              ❌ Visa Application Unsuccessful
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Unfortunately, your visa application was not approved.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              You may contact support or review your application for possible next steps.
            </p>
          </>
        )
      }
    })()}
  </>
)  : ( <> <input type="file" onChange={(e) => setFile(e.target.files[0])} /> 
  <button style={styles.primaryBtn} onClick={() => handleUpload(activeStageData?.id)}>
    Submit {STAGE_DOCS[activeStageKey]}</button> </> )} </> 
  ) : <p style={{ color: "#2ecc71", fontWeight: "600" }}>✓ Stage completed No Action Required</p>} 
  </div>
<div
  style={{
    ...styles.card,
    transform: hoveredCard === "status" ? "scale(1.03)" : "scale(1)",
    boxShadow:
      hoveredCard === "status"
        ? "0 15px 40px rgba(52,152,219,0.25)"
        : "0 8px 25px rgba(0,0,0,0.08)"
  }}
  onMouseEnter={() => setHoveredCard("status")}
  onMouseLeave={() => setHoveredCard(null)}
>
  <div style={styles.cardHeaderBlue}>
    <Activity size={18} />
    <span>Status</span>
  </div>
  

  {activeStageKey === "job_offer" ? (
  <>
    {(() => {
      const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin === true)
      const userUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin === false)
      const isCompleted = activeStageData?.status === "completed"

      // ✅ ALWAYS PRIORITIZE COMPLETED
      if (isCompleted) {
        return (
          <>
            <p>
              Current Stage: <strong>Job Offer Completed</strong>
            </p>

            <p style={{ color: "#2ecc71", fontWeight: "600", marginTop: "10px" }}>
              ✔ Job offer has been reviewed and approved
            </p>

            <p style={{ marginTop: "10px", fontSize: "13px", color: "#555" }}>
              You can now proceed to the next stage.
            </p>

            <p style={{ marginTop: "10px", fontSize: "13px", color: "#555" }}>
              Next Step: Work Permit Application
            </p>
          </>
        )
      }

      // =========================
      // NORMAL FLOW
      // =========================
      return (
        <>
          <p>
            Current Stage: <strong>Job Offer Processing</strong>
          </p>

          <ul style={{ paddingLeft: "18px", marginTop: "10px" }}>
            <li style={{ color: adminUpload ? "#2ecc71" : "#999" }}>
              {adminUpload ? "✔ Job offer letter issued" : "⏳ Waiting for job offer letter"}
            </li>

            <li style={{ color: userUpload ? "#2ecc71" : "#999" }}>
              {userUpload ? "✔ Signed document submitted" : "⏳ Awaiting signed document"}
            </li>

            <li style={{ color: userUpload ? "#f39c12" : "#999" }}>
              {userUpload ? "⏳ Under review by admin" : "Pending"}
            </li>
          </ul>

          <p style={{ marginTop: "10px", fontSize: "13px", color: "#555" }}>
            Next Step: Work Permit Application
          </p>
        </>
      )
    })()}
  </>
) : activeStageKey === "work_permit" ? (
  <>
    {(() => {
      const isCompleted = activeStageData?.status === "completed"

      // ✅ COMPLETED STATE FIRST
      if (isCompleted) {
        return (
          <>
            <p>
              Current Stage: <strong>Work Permit Approved</strong>
            </p>

            <p style={{ color: "#2ecc71", fontWeight: "600", marginTop: "10px" }}>
              ✔ Your work permit has been successfully approved.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              You can now proceed to the next stage of your application.
            </p>
          </>
        )
      }

      // =========================
      // NORMAL FLOW
      // =========================
      return (
        <>
          <p>
            Current Stage: <strong>Work Permit in Process</strong>
          </p>

          <p style={{ marginTop: "10px", fontSize: "13px", color: "#555" }}>
            Your work permit application has been officially submitted to IRCC and is now under review.
          </p>

          <p style={{ fontSize: "13px", color: "#555" }}>
            Our team is actively monitoring the progress on your behalf.
          </p>

          <p style={{ fontSize: "13px", color: "#555" }}>
            You will receive an email notification as soon as the work permit is approved and ready.
          </p>

          <p style={{ fontSize: "13px", color: "#555", fontWeight: "500", marginTop: "10px" }}>
            No action is required at this time.
          </p>
        </>
      )
    })()}
  </>
) : activeStageKey === "ielts" ? (
  <>
    {(() => {
      const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin)
      const userUpload = activeStageData?.uploads?.find(u => !u.uploaded_by_admin)

      // CASE 1
      if (!userUpload && !adminUpload) {
        return (
          <>
            <p><strong>IELTS Examination Required</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              You are required to complete your IELTS examination as part of your application process.
            </p>
          </>
        )
      }

      // CASE 2
      if (userUpload && !adminUpload) {
        return (
          <>
            <p><strong>Results Submitted</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your IELTS results have been uploaded and are under review.
            </p>
          </>
        )
      }

      // CASE 3
      if (adminUpload) {
        return (
          <>
            <p><strong>IELTS Certificate Available</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your official IELTS certificate is ready for download.
            </p>
          </>
        )
      }
    })()}
  </>
  ) : activeStageKey === "medical" ? (
  <>
    {(() => {
      const userUpload = activeStageData?.uploads?.find(u => !u.uploaded_by_admin)
      const hasBooking = activeStageData?.medical_booking_date

      if (!userUpload && !hasBooking) {
        return (
          <>
            <p><strong>Medical Examination Required</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Please upload your medical report or book an appointment.
            </p>
          </>
          
        )
      }

      if (userUpload) {
        return (
          <>
            <p><strong>Medical Report Submitted</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your report is under review by the panel physician.
            </p>
          </>
        )
      }

      if (hasBooking) {
        return (
          <>
            <p><strong>Appointment Request Submitted</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your appointment request is being confirmed.
            </p>
          </>
        )
      }
      if (activeStageData?.status === "completed") {
  return (
    <>
      <p><strong>Medical Approved</strong></p>
      <p style={{ fontSize: "13px", color: "#555" }}>
        Your medical examination has been reviewed and approved.
      </p>
    </>
  )
}
    })()}
  </>
)   : activeStageKey === "biometrics" ? (
  <>
    {(() => {
      const status = activeStageData?.biometrics_status
      const date = activeStageData?.biometrics_booking_date
      const isCompleted = activeStageData?.status === "completed"

      // ✅ ALWAYS CHECK COMPLETED FIRST
      if (isCompleted) {
        return (
          <>
            <p><strong>Biometrics Appointment Confirmed</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your appointment is confirmed for {date}.
            </p>
          </>
        )
      }

      // =========================
      // NOT BOOKED
      // =========================
      if (!date) {
        return (
          <>
            <p><strong>Biometrics Appointment Required</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Please select an available date to proceed.
            </p>
          </>
        )
      }

      // =========================
      // BOOKED → WAITING APPROVAL
      // =========================
      if (status === "pending") {
        return (
          <>
            <p><strong>Appointment Request Submitted</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Waiting for confirmation of your selected date.
            </p>
          </>
        )
      }

      // =========================
      // APPROVED (fallback if not completed yet)
      // =========================
      if (status === "approved") {
        return (
          <>
            <p><strong>Biometrics Appointment Approved</strong></p>
            <p>Your appointment is confirmed for {date}</p>
          </>
        )
      }

      // =========================
      // REJECTED
      // =========================
      if (status === "rejected") {
        return (
          <>
            <p><strong>Appointment Rejected</strong></p>
            <p>Please choose another date.</p>
          </>
        )
      }
    })()}
  </>
)
: activeStageKey === "lmia" ? (
  <>
    {(() => {
      const adminUpload = activeStageData?.uploads?.find(u => u.uploaded_by_admin)
      const isPaid = activeStageData?.lmia_payment_status === "paid"

      // CASE 1: NOT PROCESSED
      if (!isPaid) {
        return (
          <>
            <p><strong>LMIA Certificate Processing Required</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              A payment of $815 is required to begin LMIA processing.
            </p>
          </>
        )
      }
      if (isPaid && !adminUpload) {
        return (
          <>
            <p><strong>LMIA Certificate Processing</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your payment has been confirmed.  
              Your LMIA certificate will be processed and issued within 14 days.
            </p>
          </>
        )
      }

      // CASE 2: COMPLETED
      if (adminUpload) {
        return (
          <>
            <p><strong>LMIA Certificate Available</strong></p>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Your LMIA certificate has been successfully processed and uploaded.
            </p>
          </>
        )
      }
    })()}
  </>
) : activeStageKey === "visa_processing" ? (
  <>
    {(() => {
      const isPaid = activeStageData?.visa_payment_status === "paid"

      // =========================
      // CASE 1: NOT PAID
      // =========================
      if (!isPaid) {
        return (
          <>
            <p><strong>Visa Processing Required</strong></p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              To proceed with your visa application, a visa processing fee of $1,105 is required.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Once payment is confirmed, your application will be submitted for processing.
              No documents are required at this stage.
            </p>
          </>
        )
      }

      // =========================
      // CASE 2: PAID → PROCESSING
      // =========================
      if (isPaid) {
        return (
          <>
            <p><strong>Visa Processing in Progress</strong></p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Your visa processing fee has been successfully received.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Your application is currently under processing by immigration authorities.
              Background checks and verification are in progress.
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              No action is required at this stage.
            </p>
          </>
        )
      }
    })()}
  </>
)
: activeStageKey === "decision" ? (
  <>
    {activeStageData?.status !== "completed" ? (
      <>
        <p>
          Current Stage: <strong>Decision Pending</strong>
        </p>
        

        <p style={{ fontSize: "13px", color: "#555" }}>
          Your visa application is awaiting final review and decision.
        </p>
      </>
    ) : (
      <>
        <p>
          Current Stage: <strong>Decision Issued</strong>
        </p>

        <p style={{ 
          fontSize: "16px", 
          fontWeight: "600",
          color: activeStageData?.notes?.includes("Approved") ? "#2ecc71" : "#e74c3c"
        }}>
          {activeStageData?.notes}
        </p>
      </>
    )}
  </>
)

: (
    // ✅ FALLBACK → your ORIGINAL working system
    <>
      <p>Current Stage: <strong>{visa.current_stage}</strong></p>
      <div dangerouslySetInnerHTML={{ __html: activeStageData?.notes || "No updates yet" }} />
    </>
  )}
  {activeStageKey === "decision" && activeStageData?.notes && (
  <div style={{
    marginTop: "15px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #eef6ff, #d9eaff)",
    borderLeft: "4px solid #3498db"
  }}>
    <p style={{
      fontSize: "12px",
      fontWeight: "700",
      color: "#2b6cb0",
      marginBottom: "6px"
    }}>
      📌 Decision Update
    </p>

    <div dangerouslySetInnerHTML={{ __html: activeStageData.notes }} />
  </div>
)}
  <div style={{ marginTop: "10px", marginBottom: "15px" }}>
  <div style={styles.progressMini}>
    <div
      style={{
        ...styles.progressMiniFill,
        width: `${overallProgress}%`
      }}
    />
  </div>
  <p style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
    {overallProgress}% overall progress
  </p>
</div>
</div>

        {/* Support */}
        <div
  style={{
    ...styles.card,
    transform: hoveredCard === "support" ? "scale(1.03)" : "scale(1)",
    boxShadow:
      hoveredCard === "support"
        ? "0 15px 40px rgba(46,204,113,0.25)"
        : "0 8px 25px rgba(0,0,0,0.08)"
  }}
  onMouseEnter={() => setHoveredCard("support")}
  onMouseLeave={() => setHoveredCard(null)}
>
  <div style={styles.cardHeaderGreen}>
    <LifeBuoy size={18} />
    <span>Support</span>
  </div>

  <div style={{ marginBottom: "12px" }}>
    <p style={{ fontWeight: "600" }}>Email Support</p>
    <a href="mailto:info@simizi.com" style={styles.link}>
      info@simizi.net
    </a>
  </div>

  {settings?.is_whatsapp_active && settings?.whatsapp_link ? (
    <a
  href={settings.whatsapp_link}
  style={{
    ...styles.primaryBtn,
    display: "block",              // ✅ take full width
    width: "100%",                 // ✅ stay inside card
    boxSizing: "border-box",       // ✅ respect padding
    textAlign: "center",
    background: "#2ecc71"
  }}
>
      Chat on WhatsApp →
    </a>
  ) : (
    <p style={{ fontSize: "13px", color: "#888" }}>
      WhatsApp support currently unavailable
    </p>
  )}
</div>
      </div>

      {/* All Documents */}
      {/* Downloadable Documents */}
<div style={styles.downloadSection}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-3px)"
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)"
}}>
  {visa.stages
    .flatMap(stage =>
      (stage.uploads || [])
        .filter(u => u.uploaded_by_admin) // ✅ ONLY ADMIN FILES
        .map(u => ({
          ...u,
          stageKey: stage.key
        }))
    )
    .map(doc => (
      <a
        key={doc.id}
        href={doc.file}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.downloadCard}
      >
        ⬇ Download {STAGE_DOCS[doc.stageKey] || "Download File"}
      </a>
    ))}
</div>
    </div>
  )
}

export default VisaTracker

