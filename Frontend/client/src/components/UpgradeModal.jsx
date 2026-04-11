import { useState, useEffect } from "react"
import API from "../api"
import PaymentModal from "./PaymentModal"
import { Crown } from "lucide-react"

function UpgradeModal({ onClose }) {
  const [methods, setMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])

  useEffect(() => {
    fetchMethods()
  }, [])

  const fetchMethods = async () => {
    try {
      const res = await API.get("payments/methods/")
      setMethods(res.data.results || res.data)
    } catch (err) {
      console.error("Failed to load payment methods")
    }
  }

  // 👉 Open PaymentModal when method selected
  if (selectedMethod) {
  return (
    <PaymentModal
      serviceType="upgrade"
      selectedMethodId={selectedMethod.id}
      selectedMethodName={selectedMethod.name}
      onClose={() => setSelectedMethod(null)}
      onSuccess={() => {
        setSelectedMethod(null)
        setPaymentSuccess(true) // ✅ NEW
      }}
    />
  )
}
if (paymentSuccess) {
  return (
    <div style={overlay}>
      <div style={container(isMobile)}>

        <div style={{ textAlign: "center", padding: "30px 10px" }}>
          <h2 style={{ color: "#16a34a" }}>Payment Submitted 🎉</h2>

          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Your payment is under review. You’ll be notified once verified.
          </p>

          <button
            style={priceBtn}
            onClick={onClose}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}

  return (
    <div style={overlay}>
      
      <div style={container(isMobile)}>
        <div style={{ textAlign: "right" }}>
  <span onClick={onClose} style={{ cursor: "pointer", fontSize: "30px" }}>
    ×
  </span>
</div>

        {/* PREMIUM CARD */}
        <div style={premiumCard}>
          <div style={crownWrapper}>
  <Crown size={42} color="#166534" />
</div>

          <h2 style={title}>
            Upgrade to Simizi Premium
          </h2>

          <p style={subtitle}>
            Get unlimited AI tools & faster application processing.
          </p>

          <div style={priceBtn}>
            CAD 400
          </div>
        </div>

        {/* SECTION TITLE */}
        <p style={sectionTitle}>Select Payment Method</p>

        {/* PAYMENT METHODS */}
        <div style={methodsBox}>
          {methods.map(method => (
            <div
              key={method.id}
              style={methodItem}
              onClick={() => setSelectedMethod(method)}
              onMouseEnter={e =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span>{method.name}</span>
              <span style={arrow}>›</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default UpgradeModal

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.35)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 4000
}
const crownWrapper = {
  width: "64px",
  height: "64px",
  margin: "0 auto 10px",
  borderRadius: "50%",
  background: "rgba(34,197,94,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(34,197,94,0.25)"
}

const container = (isMobile) => ({
  width: isMobile ? "100%" : "420px",
  maxWidth: "100%",
  height: isMobile ? "90vh" : "auto",
  marginTop: isMobile ? "auto" : "0",

  borderTopLeftRadius: isMobile ? "20px" : "18px",
  borderTopRightRadius: isMobile ? "20px" : "18px",
  borderRadius: isMobile ? "20px 20px 0 0" : "18px",

  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(20px)",

  padding: isMobile ? "20px 16px" : "24px",
  overflowY: "auto",

  boxShadow: isMobile
    ? "0 -10px 40px rgba(0,0,0,0.2)"
    : "0 20px 60px rgba(0,0,0,0.2)"
})
const premiumCard = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(20px)",
  borderRadius: "18px",
  padding: "24px",
  textAlign: "center",
  marginBottom: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.6)"
}

const title = {
  margin: "10px 0 6px",
  fontSize: "20px",
  fontWeight: "700",
  color: "#1f2937"
}

const subtitle = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "16px"
}

const priceBtn = {
  background: "linear-gradient(135deg, #166534, #22c55e)",
  color: "white",
  padding: "14px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "18px",
  boxShadow: "0 8px 20px rgba(34,197,94,0.3)"
}

const sectionTitle = {
  marginBottom: "10px",
  fontWeight: "600",
  color: "#374151"
}

const methodsBox = {
  background: "rgba(0,0,0,0.75)",
  borderRadius: "16px",
  overflow: "hidden",
  backdropFilter: "blur(20px)"
}

const methodItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  color: "#fff",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  WebkitTapHighlightColor: "transparent"
}

const arrow = {
  opacity: 0.6,
  fontSize: "18px"
}