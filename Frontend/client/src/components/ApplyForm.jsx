import { useState } from "react"
import API from "../api"

function ApplyForm({ jobId }) {
  const [cv, setCv] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [cert, setCert] = useState(null)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cv || !photo || !cert) {
      setMessage("All files are required.")
      return
    }

    const formData = new FormData()
    formData.append("job", jobId)
    formData.append("cv", cv)
    formData.append("passport_photo", photo)
    formData.append("certificates", cert)

    try {
      await API.post("applications/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setMessage("Application submitted successfully ✅")

    }catch (err) {
  console.log("APPLICATION ERROR:", err.response?.data)
  setMessage(
    JSON.stringify(err.response?.data)
  )
}
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Apply</h3>

      <input type="file" onChange={e => setCv(e.target.files[0])} required />
      <input type="file" onChange={e => setPhoto(e.target.files[0])} required />
      <input type="file" onChange={e => setCert(e.target.files[0])} required />

      <button type="submit">Submit Application</button>

      {message && <p>{message}</p>}
    </form>
  )
}

export default ApplyForm