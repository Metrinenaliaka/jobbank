import { useEffect, useState } from "react"
import API from "../api"

function PaymentModal({ applicationId, jobId, stageId, serviceType, onClose, onSuccess }) {

  const [methods, setMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState("")
  const [reference, setReference] = useState("")
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

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
    <div style={modalOverlay}>
      <div style={modalBox}>

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
            <option value="">Select Payment Method</option>
            {methods.map(method => (
              <option key={method.id} value={String(method.id)}>
                {method.name}
              </option>
            ))}
          </select>

          {methods
            .filter(method => String(method.id) === selectedMethod)
            .map(method => (
              <div
    dangerouslySetInnerHTML={{ __html: method.instructions }}
  />
            ))}

          <input
            style={modalInput}
            placeholder="Enter Payment Reference Code"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <div style={modalButtonRow}>
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
  background: "#ccc",
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