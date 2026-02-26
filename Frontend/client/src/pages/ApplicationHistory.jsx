import { useEffect, useState } from "react"
import API from "../api"
import PaymentModal from "../components/PaymentModal"

const BASE_STEPS = [
  "applied",
  "reviewed",
  "assessment",
  "interview",
  "accepted"
]

function ApplicationHistory() {

  const [applications, setApplications] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)

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

  // ✅ UPDATE ONLY ONE APPLICATION AFTER PAYMENT
  const handlePaymentSuccess = (applicationId) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, latest_payment_status: "pending" }
          : app
      )
    )
  }

  return (
    <div style={wrapper}>
      <h2 style={{ marginBottom: "20px" }}>Application History</h2>

      {applications.length === 0 && (
        <p>No applications yet.</p>
      )}

      {applications.map(app => {

        const paymentStatus = app.latest_payment_status || "not_paid"

        const canMakePayment =
          paymentStatus === "not_paid" ||
          paymentStatus === "rejected"

        const isPending = paymentStatus === "pending"
        const isVerified = paymentStatus === "verified"
        const isRejected = paymentStatus === "rejected"

        let steps = [...BASE_STEPS]

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
          <div key={app.id} style={card}>

            <h3 style={{ marginBottom: "6px" }}>
              {app.job_title || "Job Application"}
            </h3>

            <p style={muted}>{app.company_name || ""}</p>

            <p style={muted}>
              Applied on{" "}
              {new Date(app.applied_at).toLocaleDateString()}
            </p>

            {/* TRACKER */}
            <div style={trackerContainer}>
              {steps.map((step, index) => {

                const active = index <= currentIndex

                return (
                  <div key={step} style={stepWrapper}>

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
                        background: active ? "#2ecc71" : "#ddd"
                      }}
                    />

                    <span style={label}>
                      {step.replace("_", " ")}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* PAYMENT SECTION */}

            {canMakePayment && (
              <div style={paymentBox}>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>
                  350 CAD Application Processing Fee Required
                </p>

                <button
                  style={payBtn}
                  onClick={() => setSelectedApp(app)}
                >
                  Click to Pay
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
          onSuccess={handlePaymentSuccess}
          onClose={() => setSelectedApp(null)}
        />
      )}

    </div>
  )
}

export default ApplicationHistory

/* ================= STYLES ================= */

const wrapper = {
  maxWidth: "950px",
  margin: "40px auto"
}

const card = {
  background: "white",
  padding: "22px",
  marginBottom: "18px",
  borderRadius: "10px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
}

const muted = {
  color: "#666",
  margin: "3px 0"
}

const trackerContainer = {
  display: "flex",
  marginTop: "20px",
  width: "100%",
  alignItems: "center",
  overflowX: "auto",
  paddingBottom: "10px"
}

const stepWrapper = {
  flex: 1,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "100px"
}

const circle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  zIndex: 2
}

const line = {
  position: "absolute",
  top: "9px",
  left: "-50%",
  width: "100%",
  height: "3px",
  zIndex: 1
}

const label = {
  marginTop: "8px",
  fontSize: "13px",
  textTransform: "capitalize",
  color: "#333",
  textAlign: "center"
}

const paymentBox = {
  marginTop: "20px",
  padding: "15px",
  background: "#fff8e1",
  borderRadius: "8px"
}

const payBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer"
}

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