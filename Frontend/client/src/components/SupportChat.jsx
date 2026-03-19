import { useState, useContext } from "react"
import API from "../api"
import { AuthContext } from "../context/AuthContext"

function SupportChat() {

  const { user } = useContext(AuthContext)

  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // 🚫 DO NOT SHOW FOR ADMIN OR UNAUTHENTICATED
  if (!user || user.is_staff) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!subject || !message) return

    setSuccessMsg("")
    setErrorMsg("")

    try {
      setLoading(true)

      await API.post("support/", {
        subject,
        message
      })

      setSuccessMsg("Support message sent successfully 👍")
      setSubject("")
      setMessage("")

    } catch (err) {
      setErrorMsg("Failed to send support message. Please try again.")
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

          {/* HEADER */}
          <div style={chatHeader}>
            <h3 style={{ margin: 0 }}>Support Chat</h3>
            <button
              style={closeBtn}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <p style={greetingText}>
            Hello 👋 We’d be delighted to hear from you.
          </p>

          {/* INLINE SUCCESS */}
          {successMsg && (
            <div style={successBox}>
              <span>{successMsg}</span>
              <button
                style={inlineCloseBtn}
                onClick={() => setSuccessMsg("")}
              >
                ×
              </button>
            </div>
          )}

          {/* INLINE ERROR */}
          {errorMsg && (
            <div style={errorBox}>
              <span>{errorMsg}</span>
              <button
                style={inlineCloseBtn}
                onClick={() => setErrorMsg("")}
              >
                ×
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
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

/* ================= STYLES ================= */

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
  zIndex: 3000,
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
}

const chatBox = {
  position: "fixed",
  bottom: "85px",
  right: "20px",
  width: "320px",
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
  zIndex: 4000
}

const chatHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
}

const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#555",
  fontWeight: "bold"
}

const input = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px"
}

const textarea = {
  ...input,
  minHeight: "100px",
  resize: "none"
}

const sendBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
}

const successBox = {
  background: "#e6f9f0",
  color: "#1e8449",
  padding: "8px 12px",
  borderRadius: "6px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "13px"
}

const errorBox = {
  background: "#ffe6e6",
  color: "#c0392b",
  padding: "8px 12px",
  borderRadius: "6px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "13px"
}

const inlineCloseBtn = {
  background: "transparent",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "14px"
}
const greetingText = {
  fontSize: "13px",
  color: "#555",
  marginBottom: "12px",
  lineHeight: "1.4"
}

export default SupportChat