import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [referenceCode, setReferenceCode] = useState("")
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
    e.stopPropagation()
    alert(`Apply clicked for job ${jobId}`)
  }

  const openPaymentModal = (service, e) => {
    e.stopPropagation()
    setSelectedService(service)
    setShowModal(true)
  }

  const handleSubmitPayment = () => {
    if (!paymentMethod || !referenceCode) {
      alert("Please select payment method and enter reference code.")
      return
    }

    alert(`Payment submitted for ${selectedService}`)
    setShowModal(false)
    setPaymentMethod("")
    setReferenceCode("")
  }

  return (
    <>
      <div style={pageStyle}>
        <p style={infoText}>
          Create an account and login for Simizi's assistance in navigating jobs,
          writing a Canadian resume and cover letter, and more.
        </p>

        <h2 style={titleStyle}>Job Board</h2>

        {jobs.length === 0 && <p>No jobs available</p>}

        {jobs.map((job) => (
          <div
            key={job.id}
            style={cardStyle}
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <h3>{job.title}</h3>
            <p>Employer: {job.company_name}</p>
            <p>City: {job.location_city || "None Specified"}</p>
            <p>Province/State: {job.location_province || "None Specified"}</p>

            <div style={buttonRow}>
              <button style={secondaryBtn}>Location Info</button>

              <button
                style={secondaryBtn}
                onClick={(e) => openPaymentModal("Resume Writing", e)}
              >
                Write Resume
              </button>

              <button
                style={secondaryBtn}
                onClick={(e) => openPaymentModal("Cover Letter Writing", e)}
              >
                Write Cover Letter
              </button>

              <button
                style={applyBtn}
                onClick={(e) => handleApply(job.id, e)}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>{selectedService} Payment</h3>

            <select
              style={modalInput}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="paypal">PayPal</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank Transfer</option>
            </select>

            {paymentMethod === "paypal" && (
              <p style={paymentInfo}>
                PayPal Email: payments@simizi.com
              </p>
            )}

            {paymentMethod === "mpesa" && (
              <p style={paymentInfo}>
                M-Pesa Till Number: 123456
              </p>
            )}

            {paymentMethod === "bank" && (
              <p style={paymentInfo}>
                Bank: ABC Bank <br />
                Account Number: 1234567890
              </p>
            )}

            <input
              style={modalInput}
              placeholder="Enter Payment Reference Code"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
            />

            <div style={modalButtonRow}>
              <button style={cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button style={submitBtn} onClick={handleSubmitPayment}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Jobs

/* ===== STYLES ===== */

const pageStyle = {
  maxWidth: "900px",
  margin: "auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
}

const infoText = {
  marginBottom: "20px",
  fontWeight: "500",
}

const titleStyle = {
  color: "#0066ff",
  marginBottom: "20px",
  fontSize: "30px",
  fontWeight: "700",
}

const cardStyle = {
  background: "#f6f6f8",
  borderRadius: "14px",
  padding: "22px",
  marginBottom: "20px",
  cursor: "pointer",
}

const buttonRow = {
  display: "flex",
  gap: "12px",
  marginTop: "18px",
}

const secondaryBtn = {
  flex: 1,
  border: "none",
  background: "#eef3ff",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
}

const applyBtn = {
  flex: 1,
  background: "#0066ff",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

/* MODAL */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
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