import { useState } from "react"
import API from "../api"
import toast from "react-hot-toast"

function ApplyForm({ jobId }) {
  const [cv, setCv] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [otherDocs, setOtherDocs] = useState(null)
  const [message, setMessage] = useState("")

  const validateFileType = (file, allowedTypes) => {
    if (!file) return false
    return allowedTypes.includes(file.type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cv || !coverLetter || !photo) {
      setMessage("CV, Cover Letter and Passport Photo are required.")
      return
    }

    // Validate file types
    if (!validateFileType(cv, ["application/pdf"])) {
      setMessage("CV must be a PDF file.")
      return
    }

    if (!validateFileType(coverLetter, ["application/pdf"])) {
      setMessage("Cover Letter must be a PDF file.")
      return
    }

    if (!validateFileType(photo, ["image/jpeg", "image/png", "image/jpg", "image/webp"])) {
      setMessage("Passport Photo must be an image (jpg, png, webp).")
      return
    }

    const formData = new FormData()
    formData.append("job", jobId)
    formData.append("cv", cv)
    formData.append("cover_letter", coverLetter)
    formData.append("passport_photo", photo)

    if (otherDocs) {
      formData.append("other_documents", otherDocs)
    }

    try {
      await API.post("applications/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setMessage("Application submitted successfully ✅")
      toast.success("Application submitted successfully!")

    } catch (err) {
      console.log("APPLICATION ERROR:", err.response?.data)
      setMessage(JSON.stringify(err.response?.data))
      toast.error("Failed to submit application.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Apply</h3>

      <p><strong>Upload the required documents below:</strong></p>

      <div>
        <label>CV (PDF only)</label>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={e => setCv(e.target.files[0])}
          required 
        />
      </div>

      <div>
        <label>Cover Letter (PDF only)</label>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={e => setCoverLetter(e.target.files[0])}
          required 
        />
      </div>

      <div>
        <label>Passport Photo (Image files only)</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={e => setPhoto(e.target.files[0])}
          required 
        />
      </div>

      <div>
        <label>Other Documents (Optional)</label>
        <input 
          type="file" 
          onChange={e => setOtherDocs(e.target.files[0])}
        />
      </div>

      <button type="submit">Submit Application</button>

      {message && <p>{message}</p>}
    </form>
  )
}

export default ApplyForm