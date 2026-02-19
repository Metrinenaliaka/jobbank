import { useState } from "react"
import API from "../../api"

function AdminJobs() {
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")

  const handleCreate = async (e) => {
  e.preventDefault()

  try {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await API.post("jobs/", {
      title: title,
      company_name: company,
      location_city: city,
      location_province: province,
      employment_type: "full_time",
      work_mode: "on_site",
      expires_at: expires
    })

    alert("Job created")
  } catch (err) {
    console.error(err.response?.data)
    alert("Error creating job")
  }
}


  return (
    <div className="container">
      <h2>Admin - Create Job</h2>

      <form onSubmit={handleCreate}>
        <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input placeholder="Company" onChange={e => setCompany(e.target.value)} />
        <input placeholder="City" onChange={e => setCity(e.target.value)} />
        <input placeholder="Province" onChange={e => setProvince(e.target.value)} />
        <button>Create Job</button>
      </form>
    </div>
  )
}

export default AdminJobs
