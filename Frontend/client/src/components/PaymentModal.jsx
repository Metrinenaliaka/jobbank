import { useEffect, useState } from "react"
import API from "../api"

function PaymentModal({ applicationId, jobId, stageId, selectedMethodId, serviceType, onClose, onSuccess }) {

  const [methods, setMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(
  selectedMethodId ? String(selectedMethodId) : ""
)
  const [reference, setReference] = useState("")
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
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
    } catch {
      setMessage("Failed to load payment methods.")
      setMessageType("error")
    }
  }
  const config = {
  application_fee: {
    title: "Application Processing Payment",
    amount: "350 CAD"
  },
  lmia_fee: {
    title: "LMIA Processing Payment",
    amount: "815 CAD"
  },
  visa_fee: {
    title: "Visa Processing Payment",
    amount: "1105 CAD"
  },
  upgrade: {
    title: "Upgrade to Premium",
    amount: "400 CAD"
  }
}

const current = config[serviceType] || config.application_fee

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage("")
    setMessageType("")

    if (!selectedMethod || !reference.trim()) {
      setMessage("Please select a payment method and enter reference code.")
      setMessageType("error")
      return
    }

    try {
      setLoading(true)

      await API.post("payments/", {
        job: jobId,
        application: applicationId,
        service_type: serviceType,
        payment_method: Number(selectedMethod),
        reference_code: reference,
      })

  //     if (serviceType === "lmia_fee") {
  // await API.patch(`visa-stage/${stageId}/update/`, {
  //   lmia_payment_status: "paid"
  // })}

      // 🔥 UPDATE ONLY THAT APPLICATION IN PARENT
      onSuccess(applicationId)

      setMessage("Payment submitted successfully. Await verification.")
      setMessageType("success")

      setSelectedMethod("")
      setReference("")

      // Auto close after short delay
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (err) {

      const backendMessage =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "A payment for this application is still being processed."

      setMessage(backendMessage)
      setMessageType("error")

    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay(isMobile)}>
      <div style={container(isMobile)}>

        <h2>{current.title}</h2>
        <h3>Make a Payment Equivalent to {current.amount}</h3>

        {message && (
          <div
            style={{
              ...messageBox,
              background:
                messageType === "error" ? "#fdecea" : "#e8f5e9",
              color:
                messageType === "error" ? "#c62828" : "#2e7d32",
            }}
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              style={closeMessageBtn}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <select
            style={modalInput}
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <option value="" >Select Payment Method</option>
            {methods.map(method => (
              <option key={method.id} value={String(method.id)}>
                {method.name}
              </option>
            ))}
          </select>

          {methods
            .filter(method => String(method.id) === selectedMethod)
            .map(method => (
             <div style={instructionsBox}
  dangerouslySetInnerHTML={{ __html: method.instructions }}
/>
            ))}

          <input
          onFocus={(e) => {
  e.target.style.border = "1px solid #22c55e"
  e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)"
}}
onBlur={(e) => {
  e.target.style.border = "1px solid rgba(0,0,0,0.1)"
  e.target.style.boxShadow = "none"
}}
            style={modalInput}
            placeholder="Enter Payment Reference Code"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <div style={modalButtonRow(isMobile)}>
            <button
              type="button"
              style={cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={submitBtn}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default PaymentModal

/* ===== STYLES ===== */

const overlay = (isMobile) => ({
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.35)",
  backdropFilter: "blur(8px)",
  display: "flex",

  justifyContent: isMobile ? "center" : "center",
  alignItems: isMobile ? "flex-end" : "center", // 🔥 KEY CHANGE

  zIndex: 4000
})

const container = (isMobile) => ({
  width: isMobile ? "100%" : "420px",
  maxWidth: "100%",

  height: isMobile ? "92vh" : "auto", // 🔥 more breathing room

  borderRadius: isMobile ? "20px 20px 0 0" : "18px",

  background: "rgba(255,255,255,0.98)",
  backdropFilter: "blur(20px)",

  padding: isMobile ? "20px 16px 24px" : "24px",

  overflowY: "auto",

  display: "flex",              // 🔥 important
  flexDirection: "column",      // 🔥 important

  boxShadow: isMobile
    ? "0 -12px 40px rgba(0,0,0,0.25)"
    : "0 20px 60px rgba(0,0,0,0.2)"
})
const title = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#065f46",
  marginBottom: "6px"
}

const amountText = {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "16px"
}

const modalInput = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",

  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.15)",

  background: "#ffffff", // 🔥 solid white
  color: "#111827",

  fontSize: "14px",

  boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // 🔥 subtle depth

  transition: "all 0.2s ease"
}
const modalButtonRow = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "10px",
  marginTop: "10px"
})

const cancelBtn = {
  background: "rgba(0,0,0,0.05)",
  color: "#374151",
  border: "1px solid rgba(0,0,0,0.1)",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "500"
}

const submitBtn = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",

  boxShadow: "0 10px 25px rgba(34,197,94,0.3)",
  transition: "all 0.2s ease"
}

const paymentInfo = {
  fontSize: "14px",
  marginBottom: "10px",
}

const messageBox = {
  padding: "10px 12px",
  borderRadius: "6px",
  marginBottom: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "14px",
}

const closeMessageBtn = {
  background: "transparent",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
}
const instructionsBox = {
  fontSize: "13px",
  lineHeight: "1.5",
  background: "rgba(0,0,0,0.05)",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "12px",
  border: "1px solid rgba(0,0,0,0.08)"
}