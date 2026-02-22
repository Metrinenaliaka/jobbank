import { useState, useEffect, useContext } from "react"
import toast from "react-hot-toast"
import API from "../api"
import { AuthContext } from "../context/AuthContext"

function SupportChat() {

  const { user } = useContext(AuthContext)

  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // 🚫 DO NOT SHOW FOR ADMIN
  if (!user || user.is_staff) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!subject || !message) return

    try {
      setLoading(true)

      await API.post("support/", {
        subject,
        message
      })

      toast.success("Support message sent 👍")
      setSubject("")
      setMessage("")
      setOpen(false)

    } catch (err) {
      console.log(err)
      toast.error("Failed to send support message.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button style={floatingBtn} onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* CHAT POPUP */}
      {open && (
        <div style={chatBox}>
          <h3 style={{ marginTop: 0 }}>Support Chat</h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              style={input}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <textarea
              style={textarea}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button style={sendBtn} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

/* ===== STYLES ===== */

const floatingBtn = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  border: "none",
  background: "#25D366",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  zIndex: 999
}

const chatBox = {
  position: "fixed",
  bottom: "85px",
  right: "20px",
  width: "320px",
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
  zIndex: 999
}

const input = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px"
}

const textarea = {
  ...input,
  minHeight: "100px"
}

const sendBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer"
}

export default SupportChat
