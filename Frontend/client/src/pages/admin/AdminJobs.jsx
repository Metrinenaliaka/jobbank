import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast" 
import API from "../../api"


function AdminJobs() {

  const emptyForm = {
    title: "",
    company_name: "",
    location_city: "",
    location_province: "",
    salary: "",
    salary_type: "",
    hours_per_week: "",
    employment_type: "full_time",
    work_mode: "on_site",
    vacancies: 1,
    start_date: "",
    benefits: "",
    languages: "",
    education: "",
    experience: "",
    work_environment: "",
    work_setting: "",
    responsibilities: "",
    supervision: "",
    specialization: "",
    is_active: true
  }

  const [activeTab, setActiveTab] = useState("create")
  const [jobs, setJobs] = useState([])
  const [payments, setPayments] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [methods, setMethods] = useState([])
  const [methodForm, setMethodForm] = useState({
    name: "",
    code: "",
    instructions: "",
    is_active: true
  })
  const [editingMethodId, setEditingMethodId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchJobs = async () => {
    const res = await API.get("jobs/")
    setJobs(res.data.results || res.data)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await API.get("payments/")
      setPayments(res.data.results || res.data)
    } catch (err) {
      console.log("Payment fetch error:", err.response?.data)
    } 
  }

  const fetchMethods = async () => {
    try {
      const res = await API.get("payments/methods/")
      setMethods(res.data.results || res.data)
    } catch (err) {
      console.log("Method fetch error:", err.response?.data)
    }
  }

  const updatePaymentStatus = async (id, status) => {
    try {
      await API.patch(`payments/${id}/`, { status })
      fetchPayments()
    } catch (err) {
      toast.error("Failed to update payment.")
    }
  }

  const cleanPayload = (data) => ({
    ...data,
    salary: data.salary === "" ? null : Number(data.salary),
    hours_per_week:
      data.hours_per_week === "" ? null : Number(data.hours_per_week),
    vacancies: data.vacancies === "" ? 1 : Number(data.vacancies),
  })

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value

    setForm({ ...form, [e.target.name]: value })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = cleanPayload({
      ...form,
      expires_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString()
    })

    try {
      if (editingId) {
        await API.patch(`jobs/${editingId}/`, payload)
        toast.success("Job updated")
      } else {
        await API.post("jobs/", payload)
        toast.success("Job created")
      }

      resetForm()
      fetchJobs()
      setActiveTab("manage")

    } catch (err) {
      toast.error(JSON.stringify(err.response?.data))
    }
  }

  const handleEdit = (job) => {
    setEditingId(job.id)
    setForm({ ...emptyForm, ...job })
    setActiveTab("create")
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return
    await API.delete(`jobs/${id}/`)
    fetchJobs()
  }

  return (
    <div style={wrapper}>

      <h1 style={{ marginTop: 0 }}>Admin Dashboard</h1>

      <div style={tabs}>
        <button
          style={activeTab === "payments" ? activeTabStyle : tabStyle}
          onClick={() => {
            setActiveTab("payments")
            fetchPayments()
          }}
        >
          Payments
        </button>
      </div>

      {activeTab === "payments" && (
        <div style={{ marginTop: "20px" }}>

          {payments.length === 0 && <p>No payments found.</p>}

          {payments.map(payment => (
            <div key={payment.id} style={card}>
              <div>
                <b>{payment.service_type}</b>
                <p>User: {payment.user_full_name}</p>
                <p>Email: {payment.user_email}</p>
                <p>Job: {payment.job_title || "N/A"}</p>

                {/* ✅ FIXED LINE HERE */}
                <p style={{ margin: "4px 0" }}>
                  Method: {payment.payment_method_name}
                </p>

                <p style={{ margin: "4px 0" }}>
                  Reference: {payment.reference_code}
                </p>
                <p style={{ margin: "4px 0" }}>
                  Status: <strong>{payment.status}</strong>
                </p>
                <p style={{ fontSize: "12px", color: "#777" }}>
                  {new Date(payment.created_at).toLocaleString()}
                </p>
              </div>

              {payment.status === "pending" && (
                <div>
                  <button
                    onClick={() => updatePaymentStatus(payment.id, "verified")}
                    style={{ marginRight: "8px" }}
                  >
                    Verify
                  </button>

                  <button
                    onClick={() => updatePaymentStatus(payment.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>
      )}

    </div>
  )
}

const wrapper = {
  maxWidth: "900px",
  margin: "40px auto",
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
}

const tabs = { display:"flex", gap:"10px", marginBottom:"20px" }

const tabStyle = { padding:"10px 18px", border:"none", background:"#eee", borderRadius:"6px" }

const activeTabStyle = { ...tabStyle, background:"#2ecc71", color:"white" }

const card = {
  display:"flex",
  justifyContent:"space-between",
  padding:"15px",
  border:"1px solid #ddd",
  marginBottom:"10px",
  borderRadius:"6px"
}

export default AdminJobs