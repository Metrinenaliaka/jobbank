import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../../api"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import AdminUsers from "./AdminUsers"
import AdminVisa from "./AdminVisa"

import CreatableSelect from "react-select/creatable"

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
    tags: [],
    is_active: true
  }
  useEffect(() => {
  document.title = "Simizi | Admin Panel"
}, [])

  const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem("adminActiveTab") || "create"
})
  const [jobs, setJobs] = useState([])
  const [payments, setPayments] = useState([])
  const [methods, setMethods] = useState([])
  const [tags, setTags] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingMethodId, setEditingMethodId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [paymentSearchInput, setPaymentSearchInput] = useState("")
const [paymentSearch, setPaymentSearch] = useState("")
const [paymentActions, setPaymentActions] = useState({})

  const [methodForm, setMethodForm] = useState({
    name: "",
    code: "",
    instructions: "",
    is_active: true
  })

  /* ================= FETCH ================= */

  const fetchJobs = async () => {
    try {
      const res = await API.get("jobs/")
      setJobs(res.data.results || res.data)
    } catch {
      toast.error("Failed to fetch jobs.")
    }
  }

  const fetchTags = async () => {
    try {
      const res = await API.get("tags/")
      setTags(res.data.results || res.data)
    } catch {
      toast.error("Failed to fetch tags.")
    }
  }

  const fetchPayments = async () => {
    try {
      const res = await API.get("payments/")
      setPayments(res.data.results || res.data)
    } catch {
      toast.error("Failed to fetch payments.")
    }
  }

  const fetchMethods = async () => {
    try {
      const res = await API.get("payments/methods/")
      setMethods(res.data.results || res.data)
    } catch {
      toast.error("Failed to fetch payment methods.")
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchTags()
  }, [])

  /* ================= JOB FORM ================= */

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value

    setForm({ ...form, [e.target.name]: value })
  }

  const cleanPayload = (data) => ({
    ...data,
    salary: data.salary === "" ? null : Number(data.salary),
    hours_per_week: data.hours_per_week === "" ? null : Number(data.hours_per_week),
    vacancies: data.vacancies === "" ? 1 : Number(data.vacancies),
  })

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

    setForm({
      ...emptyForm,
      ...job,
      tags: job.tags ? job.tags.map(t => t.id) : []
    })

    setActiveTab("create")
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return
    await API.delete(`jobs/${id}/`)
    fetchJobs()
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  /* ================= PAYMENT METHODS ================= */

  const handleMethodSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingMethodId) {
        await API.patch(`payments/methods/${editingMethodId}/`, methodForm)
        toast.success("Method updated")
      } else {
        await API.post("payments/methods/", methodForm)
        toast.success("Method created")
      }

      setMethodForm({
        name: "",
        code: "",
        instructions: "",
        is_active: true
      })

      setEditingMethodId(null)
      fetchMethods()

    } catch {
      toast.error("Failed to save method")
    }
  }

  const handleEditMethod = (method) => {
    setEditingMethodId(method.id)
    setMethodForm(method)
    setActiveTab("methods")
  }

  const handleDeleteMethod = async (id) => {
    if (!window.confirm("Delete this method?")) return
    await API.delete(`payments/methods/${id}/`)
    fetchMethods()
  }

  const updatePaymentStatus = async (id, status) => {
  try {
    // 🔥 set local loading
    setPaymentActions(prev => ({
      ...prev,
      [id]: { loading: true }
    }))

    await API.patch(`payments/${id}/`, { status })

    // 🔥 instant UI update
    setPayments(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status } : p
      )
    )

    setPaymentActions(prev => ({
      ...prev,
      [id]: { loading: false, status }
    }))

    toast.success(`Payment ${status}`)
  } catch {
    toast.error("Failed to update payment.")
    setPaymentActions(prev => ({
      ...prev,
      [id]: { loading: false }
    }))
  }
}
useEffect(() => {
  localStorage.setItem("adminActiveTab", activeTab)
}, [activeTab])

const filteredPayments = payments.filter(p =>
  p.user_full_name?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
  p.user_email?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
  p.job_title?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
  p.reference_code?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
  p.status?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
  p.payment_method_name?.toLowerCase().includes(paymentSearch.toLowerCase())
)
  /* ================= RENDER ================= */

  return (
    <div style={wrapper}>
      <h1 style={{ marginTop: 0 }}>Admin Dashboard</h1>

      <div style={adminNav}>
        <button
          style={activeTab === "create" ? activeAdminTab : adminTab}
          onClick={() => { resetForm(); setActiveTab("create") }}
        >
          {editingId ? "Edit Job" : "Create Job"}
        </button>

        <button
          style={activeTab === "manage" ? activeAdminTab : adminTab}
          onClick={() => setActiveTab("manage")}
        >
          Manage Jobs
        </button>

        <Link to="/admin/applications" style={adminTab}>Applications</Link>
        <Link to="/admin/support" style={adminTab}>Support</Link>

        <button
          style={activeTab === "payments" ? activeAdminTab : adminTab}
          onClick={() => { setActiveTab("payments"); fetchPayments() }}
        >
          Payments
          
        </button>
        <button
  style={activeTab === "visa" ? activeAdminTab : adminTab}
  onClick={() => setActiveTab("visa")}
>
  Visa Tracker
</button>

        <button
          style={activeTab === "methods" ? activeAdminTab : adminTab}
          onClick={() => { setActiveTab("methods"); fetchMethods() }}
        >
          Payment Methods
        </button>
        <button
  style={activeTab === "users" ? activeAdminTab : adminTab}
  onClick={() => setActiveTab("users")}
>
  Users
</button>
      </div>

      {/* CREATE / EDIT JOB */}
      {activeTab === "create" && (
        <form onSubmit={handleSubmit} style={formStyle}>

          <h3 style={sectionTitle}>Basic Info</h3>
          <input
  style={{ ...input, textTransform: "none" }}
  name="title"
  placeholder="Title"
  value={form.title}
  onChange={handleChange}
  required
/>
          <input style={input} name="company_name" placeholder="Company" value={form.company_name} onChange={handleChange} required />
          <input style={input} name="location_city" placeholder="City" value={form.location_city} onChange={handleChange} required />
          <input style={input} name="location_province" placeholder="Province" value={form.location_province} onChange={handleChange} required />
          <input style={input} name="start_date" placeholder="Start Date" value={form.start_date} onChange={handleChange} />
          <input style={input} type="number" name="vacancies" placeholder="Vacancies" value={form.vacancies} onChange={handleChange} />

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

          <h3 style={sectionTitle}>Benefits</h3>
          <ReactQuill
  theme="snow"
  value={form.benefits}
  onChange={(value) => setForm({ ...form, benefits: value })}
  placeholder="List benefits, e.g. health insurance, paid time off, etc."
/>

          <h3 style={sectionTitle}>Overview</h3>
          <input style={input} name="languages" placeholder="Languages" value={form.languages} onChange={handleChange} />
          <ReactQuill
  theme="snow"
  value={form.education}
  onChange={(value) => setForm({ ...form, education: value })}
  placeholder="Education requirements"
/>
          <input style={input} name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} />
          <ReactQuill
  theme="snow"
  value={form.work_environment}
  onChange={(value) => setForm({ ...form, work_environment: value })}
  placeholder="Describe the work environment"
/>
          <input style={input} name="work_setting" placeholder="Work Setting" value={form.work_setting} onChange={handleChange} />

          <h3 style={sectionTitle}>Responsibilities</h3>
          <ReactQuill
  theme="snow"
  value={form.responsibilities}
  onChange={(value) => setForm({ ...form, responsibilities: value })}
  placeholder="Describe the job responsibilities"
/>
          <input style={input} name="supervision" placeholder="Supervision" value={form.supervision} onChange={handleChange} />
          <ReactQuill
  theme="snow"
  value={form.specialization}
  onChange={(value) => setForm({ ...form, specialization: value })}
  placeholder="Describe any specialization requirements"
/>

         
          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            Active
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          </label>

          <button style={saveBtn}>
            {editingId ? "Update Job" : "Create Job"}
          </button>
        </form>
      )}

      {/* MANAGE JOBS */}
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

      {/* PAYMENTS */}
      {activeTab === "payments" && (
  <div style={{ marginTop: "20px" }}>

    {/* 🔍 SEARCH BAR */}
    <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
      <input
        type="text"
        placeholder="Search payments..."
        value={paymentSearchInput}
        onChange={(e) => setPaymentSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setPaymentSearch(paymentSearchInput)
          }
        }}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ddd"
        }}
      />

      <button
        onClick={() => setPaymentSearch(paymentSearchInput)}
        style={{
          padding: "8px 12px",
          background: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Search
      </button>

      <button
        onClick={() => {
          setPaymentSearch("")
          setPaymentSearchInput("")
        }}
        style={{
          padding: "8px 12px",
          background: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Clear
      </button>
    </div>

    {/* EMPTY STATE */}
    {filteredPayments.length === 0 && (
      <p style={{ color: "#999" }}>No matching payments found.</p>
    )}

    {/* PAYMENTS LIST */}
    {filteredPayments.map(payment => (
      <div key={payment.id} style={card}>
        <div>
          <b>{payment.service_type}</b>
          <p>User: {payment.user_full_name}</p>
          <p>Email: {payment.user_email}</p>
          <p>Job: {payment.job_title || "N/A"}</p>
          <p>Method: {payment.payment_method_name}</p>
          <p>Reference: {payment.reference_code}</p>
          <p>Status: {payment.status}</p>
          <p style={{ fontSize: "12px", color: "#777" }}>
            {new Date(payment.created_at).toLocaleString()}
          </p>
        </div>

       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

  {/* VERIFIED STATE */}
  {(payment.status === "verified" || paymentActions[payment.id]?.status === "verified") && (
    <span style={styles.verifiedBadge}>✔ Verified</span>
  )}

  {/* REJECTED STATE */}
  {(payment.status === "rejected" || paymentActions[payment.id]?.status === "rejected") && (
    <span style={styles.rejectedBadge}>✖ Rejected</span>
  )}

  {/* ACTION BUTTONS */}
  {payment.status === "pending" && (
    <>
      <button
        style={styles.verifyBtn}
        disabled={paymentActions[payment.id]?.loading}
        onClick={() => updatePaymentStatus(payment.id, "verified")}
      >
        {paymentActions[payment.id]?.loading ? "..." : "Verify"}
      </button>

      <button
        style={styles.rejectBtn}
        disabled={paymentActions[payment.id]?.loading}
        onClick={() => updatePaymentStatus(payment.id, "rejected")}
      >
        {paymentActions[payment.id]?.loading ? "..." : "Reject"}
      </button>
    </>
  )}
</div>
      </div>
    ))}
  </div>
)}

      {/* PAYMENT METHODS */}
      {activeTab === "methods" && (
        <div style={{ marginTop: "20px" }}>
          <form onSubmit={handleMethodSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input style={input} placeholder="Method Name"
              value={methodForm.name}
              onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
              required />
            <input style={input} placeholder="Code"
              value={methodForm.code}
              onChange={(e) => setMethodForm({ ...methodForm, code: e.target.value })} />
            <ReactQuill
  theme="snow"
  value={methodForm.instructions}
  onChange={(value) =>
    setMethodForm({ ...methodForm, instructions: value })
  }
  placeholder="Payment instructions (e.g. send money, reference code, etc.)"
/>
            <label>
              Active
              <input type="checkbox"
                checked={methodForm.is_active}
                onChange={(e) => setMethodForm({ ...methodForm, is_active: e.target.checked })} />
            </label>
            <button style={saveBtn}>
              {editingMethodId ? "Update Method" : "Create Method"}
            </button>
          </form>

          {methods.map(method => (
            <div key={method.id} style={card}>
              <div>
                <b>{method.name}</b>
                <p>Status: {method.is_active ? "Active" : "Inactive"}</p>
                <div
    dangerouslySetInnerHTML={{ __html: method.instructions }}
  />
                
              </div>
              <div>
                <button onClick={() => handleEditMethod(method)}>Edit</button>
                <button onClick={() => handleDeleteMethod(method.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
     
{activeTab === "visa" && <AdminVisa />}
      {activeTab === "users" && <AdminUsers />}

    </div>
  )
}

/* STYLES */
const wrapper = { maxWidth: "900px", margin: "40px auto", background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }
const adminNav = { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px" }
const adminTab = { padding: "10px 18px", background: "#f1f1f1", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", textDecoration: "none", color: "#333" }
const activeAdminTab = { ...adminTab, background: "#2ecc71", color: "white" }
const formStyle = { display: "flex", flexDirection: "column", gap: "10px" }
const input = { padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }
const textarea = { ...input, minHeight: "90px" }
const sectionTitle = { marginTop: "20px", marginBottom: "5px", color: "#2ecc71" }
const saveBtn = { background: "#2ecc71", color: "white", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer" }
const card = { display: "flex", justifyContent: "space-between", padding: "15px", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "6px" }

const styles = {
  verifyBtn: {
    padding: "6px 12px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  },

  rejectBtn: {
    padding: "6px 12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  },

  verifiedBadge: {
    padding: "6px 10px",
    background: "#e8f8f5",
    color: "#27ae60",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600"
  },

  rejectedBadge: {
    padding: "6px 10px",
    background: "#fdecea",
    color: "#e74c3c",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600"
  }
}
export default AdminJobs