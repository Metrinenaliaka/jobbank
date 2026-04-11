import { useState, useContext } from "react"
import API from "../api"
import { AuthContext } from "../context/AuthContext"
import { MessageCircleMore } from "lucide-react"

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
        <MessageCircleMore
  size={46}
  strokeWidth={2.2}
  style={{
    filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))"
  }}
/>
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

            <button
  style={sendBtn}
  disabled={loading}
  onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"
    e.currentTarget.style.boxShadow = `
      0 20px 40px rgba(34,197,94,0.45),
      0 0 50px rgba(34,197,94,0.35),
      inset 0 1px 0 rgba(255,255,255,0.7)
    `
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0) scale(1)"
    e.currentTarget.style.boxShadow = `
      0 10px 25px rgba(34,197,94,0.35),
      0 0 30px rgba(34,197,94,0.25),
      inset 0 1px 0 rgba(255,255,255,0.6)
    `
  }}
  onMouseDown={e => {
    e.currentTarget.style.transform = "scale(0.95)"
  }}
  onMouseUp={e => {
    e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"
  }}
>
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
  bottom: "16px",
  right: "16px",
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "linear-gradient(135deg, #22c55e, #15803d)",
  color: "white",

  boxShadow: `
    0 12px 35px rgba(34,197,94,0.45),
    0 0 45px rgba(34,197,94,0.35),
    inset 0 2px 4px rgba(255,255,255,0.5)
  `,

  transition: "all 0.25s ease",
  zIndex: 3000
}
const chatBox = {
  position: "fixed",
  bottom: "80px",
  right: "10px",
  left: "10px",              // 🔥 THIS fixes overflow
  maxWidth: "400px",
  margin: "0 auto",

  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(16px)",

  borderRadius: "16px",
  padding: "16px",

  boxShadow: `
  0 25px 60px rgba(0,0,0,0.25),
  0 0 40px rgba(34,197,94,0.08),
  inset 0 1px 0 rgba(255,255,255,0.6)
`,
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
  padding: "12px",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "8px",
  fontSize: "14px",
  background: "rgba(255,255,255,0.9)", // 🔥 force light
  color: "#111"
}

const textarea = {
  ...input,
  minHeight: "100px",
  resize: "none"
}

const sendBtn = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.25s ease",

  boxShadow: `
    0 10px 25px rgba(34,197,94,0.35),   /* base depth */
    0 0 30px rgba(34,197,94,0.25),      /* glow */
    inset 0 1px 0 rgba(255,255,255,0.6) /* light reflection */
  `
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