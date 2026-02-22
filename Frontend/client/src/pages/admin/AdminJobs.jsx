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
  const [form, setForm] = useState(emptyForm)

  // ===== FETCH =====
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
const updatePaymentStatus = async (id, status) => {
  try {
    console.log("Sending PATCH request...")
    await API.patch(`payments/${id}/`, { status })
    console.log("Status updated successfully")
    fetchPayments()
  } catch (err) {
    console.log("Update error:", err.response?.data || err.message)
    toast.error("Failed to update payment.")
  }
}

  // ===== CLEAN NUMBERS =====
  const cleanPayload = (data) => ({
    ...data,
    salary: data.salary === "" ? null : Number(data.salary),
    hours_per_week:
      data.hours_per_week === "" ? null : Number(data.hours_per_week),
    vacancies: data.vacancies === "" ? 1 : Number(data.vacancies),
  })

  // ===== FORM =====
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
  

  // ===== CREATE / UPDATE =====
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
      console.log(err.response?.data)
      toast.error(JSON.stringify(err.response?.data))
    }
  }

  // ===== EDIT =====
  const handleEdit = (job) => {
    setEditingId(job.id)
    setForm({ ...emptyForm, ...job })
    setActiveTab("create")
  }

  const handleCancelEdit = () => {
    resetForm()
    setActiveTab("create")
  }

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return
    await API.delete(`jobs/${id}/`)
    fetchJobs()
  }

  return (
    <div style={wrapper}>

      <h1 style={{ marginTop: 0 }}>Admin Dashboard</h1>

      {/* ⭐ ADMIN NAVIGATION */}
      <div style={adminNav}>
        

        

      {/* ===== LOCAL TABS ===== */}
      <div style={tabs}>
        <button
          style={activeTab === "create" ? activeTabStyle : tabStyle}
          onClick={() => {
            resetForm()
            setActiveTab("create")
          }}
        >
          {editingId ? "Edit Job" : "Create Job"}
        </button>

        <button
          style={activeTab === "manage" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("manage")}
        >
          Manage Jobs
        </button>
        <Link to="/admin/applications" style={adminNavBtn}>
          Applications
        </Link>

        {/* ⭐ NEW SUPPORT TAB */}
        <Link to="/admin/support" style={adminNavBtn}>
          Support
        </Link>
      </div>
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
      

      {/* ===== FORM ===== */}
      {activeTab === "create" && (
        <form onSubmit={handleSubmit} style={formStyle}>

          <h3 style={sectionTitle}>Basic Info</h3>
          <input style={input} name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input style={input} name="company_name" placeholder="Company" value={form.company_name} onChange={handleChange} required />
          <input style={input} name="location_city" placeholder="City" value={form.location_city} onChange={handleChange} required />
          <input style={input} name="location_province" placeholder="Province" value={form.location_province} onChange={handleChange} required />

          <h3 style={sectionTitle}>Compensation</h3>
          <input style={input} name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
          <input style={input} name="salary_type" placeholder="Salary Type" value={form.salary_type} onChange={handleChange} />
          <input style={input} name="hours_per_week" placeholder="Hours per week" value={form.hours_per_week} onChange={handleChange} />

          <select style={input} name="employment_type" value={form.employment_type} onChange={handleChange}>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="permanent">Permanent</option>
          </select>

          <select style={input} name="work_mode" value={form.work_mode} onChange={handleChange}>
            <option value="on_site">On Site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>

          <h3 style={sectionTitle}>Overview</h3>
          <input style={input} name="languages" placeholder="Languages" value={form.languages} onChange={handleChange}/>
          <textarea style={textarea} name="education" placeholder="Education" value={form.education} onChange={handleChange}/>
          <input style={input} name="experience" placeholder="Experience" value={form.experience} onChange={handleChange}/>

          <h3 style={sectionTitle}>Responsibilities</h3>
          <textarea style={textarea} name="responsibilities" placeholder="Responsibilities" value={form.responsibilities} onChange={handleChange}/>
          <input style={input} name="supervision" placeholder="Supervision" value={form.supervision} onChange={handleChange}/>
          <textarea style={textarea} name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange}/>

          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            Active
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}/>
          </label>

          <button style={saveBtn}>
            {editingId ? "Update Job" : "Create Job"}
          </button>

          {editingId && (
            <button type="button" style={cancelBtn} onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}

        </form>
      )}
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
          <p style={{ margin: "4px 0" }}>
            Method: {payment.payment_method}
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

      {/* ===== MANAGE ===== */}
      {activeTab === "manage" && (
        <div>
          {jobs.map(job => (
            <div key={job.id} style={card}>
              <div>
                <b>{job.title}</b>
                <p style={{ margin: "5px 0", color: "#666" }}>{job.company_name}</p>
              </div>

              <div>
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job.id)} style={{ marginLeft: 10 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

/* ===== STYLES ===== */

const wrapper = {
  maxWidth: "900px",
  margin: "40px auto",
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
}

const adminNav = { display:"flex", gap:"10px", marginBottom:"20px" }

const adminNavBtn = {
  padding:"10px 16px",
  background:"#eee",
  textDecoration:"none",
  borderRadius:"6px",
  color:"#333",
  fontWeight:"600"
}

const activeAdminNav = {
  ...adminNavBtn,
  background:"#2ecc71",
  color:"white"
}

const tabs = { display:"flex", gap:"10px", marginBottom:"20px" }

const tabStyle = { padding:"10px 18px", border:"none", background:"#eee", borderRadius:"6px" }

const activeTabStyle = { ...tabStyle, background:"#2ecc71", color:"white" }

const formStyle = { display:"flex", flexDirection:"column", gap:"10px" }

const input = { padding:"10px", border:"1px solid #ddd", borderRadius:"6px" }

const textarea = { ...input, minHeight:"90px" }

const sectionTitle = { marginTop:"20px", marginBottom:"5px", color:"#2ecc71" }

const saveBtn = {
  background:"#2ecc71",
  color:"white",
  border:"none",
  padding:"12px",
  borderRadius:"6px",
  cursor:"pointer"
}

const cancelBtn = {
  background:"#ddd",
  border:"none",
  padding:"10px",
  borderRadius:"6px",
  cursor:"pointer"
}

const card = {
  display:"flex",
  justifyContent:"space-between",
  padding:"15px",
  border:"1px solid #ddd",
  marginBottom:"10px",
  borderRadius:"6px"
}

export default AdminJobs
