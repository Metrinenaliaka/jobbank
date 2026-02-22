import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import toast from "react-hot-toast"

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [referenceCode, setReferenceCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])

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

    const fetchPaymentMethods = async () => {
      try {
        const res = await API.get("payments/methods/")
        setPaymentMethods(res.data.results || res.data)
      } catch (err) {
        console.error("Error fetching payment methods:", err)
      }
    }

    fetchJobs()
    fetchPaymentMethods()
  }, [])

  const handleApply = (jobId, e) => {
    e.stopPropagation()
    toast.success(`Apply clicked for job ${jobId}`)
  }

  const openPaymentModal = (service, jobId, e) => {
    e.stopPropagation()
    setSelectedService(service)
    setSelectedJobId(jobId)
    setShowModal(true)
  }

  const handleSubmitPayment = async () => {
    if (!paymentMethod || !referenceCode) {
      toast.error("Please select payment method and enter reference code.")
      return
    }

    try {
      setLoading(true)

      const payload = {
        service_type:
          selectedService === "Resume Writing"
            ? "resume"
            : "cover_letter",
        payment_method: paymentMethod, // unchanged
        reference_code: referenceCode,
      }

      if (selectedJobId) {
        payload.job = selectedJobId
      }

      await API.post("payments/", payload)

      toast.success("Payment submitted successfully! Check your email.")

      setShowModal(false)
      setPaymentMethod("")
      setReferenceCode("")
      setSelectedJobId(null)

    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message)
      toast.error("Payment submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
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
                onClick={(e) =>
                  openPaymentModal("Resume Writing", job.id, e)
                }
              >
                Write Resume
              </button>

              <button
                style={secondaryBtn}
                onClick={(e) =>
                  openPaymentModal("Cover Letter Writing", job.id, e)
                }
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
              {paymentMethods.map(method => (
                <option key={method.id} value={String(method.id)}>
                  {method.name}
                </option>
              ))}
            </select>

            {/* FIXED: compare as string */}
            {paymentMethods
              .filter(method => String(method.id) === paymentMethod)
              .map(method => (
                <p key={method.id} style={paymentInfo}>
                  {method.instructions}
                </p>
              ))}

            <input
              style={modalInput}
              placeholder="Enter Payment Reference Code"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
            />

            <div style={modalButtonRow}>
              <button
                style={cancelBtn}
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                style={submitBtn}
                onClick={handleSubmitPayment}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
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
  fontSize: "25px",
  fontFamily: "Georgia, serif",
  color: "#06f385",
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

const modalOverlay = {
  position: "fixed",
  inset: 0,
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