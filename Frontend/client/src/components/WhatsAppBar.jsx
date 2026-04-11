import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import API from "../api"

function WhatsAppBar({ hidden }) {
  if (hidden) return null

  const [settings, setSettings] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("site-settings/")
        setSettings(res.data)
        
      } catch (err) {
        console.error("Failed to load site settings")
      }
    }

    fetchSettings()
  }, [])

  if (!settings || !settings.is_whatsapp_active || !settings.whatsapp_link) {
    return null
  }

  return (
        <a
    href={settings.whatsapp_link}
    target="_blank"
    rel="noopener noreferrer"
    style={{
  ...wrapper(isMobile),
  background: isHovered
    ? "rgba(34,197,94,0.15)"
    : "rgba(255,255,255,0.7)"
}}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onTouchStart={e => {
  e.currentTarget.style.opacity = "0.8"
}}
onTouchEnd={e => {
  e.currentTarget.style.opacity = "1"
}}
    >
      <div style={left}>
        <div style={iconCircle}>
          <FaWhatsapp size={18} />
        </div>
        <span style={text(isMobile)}>Customer Service online 24/7</span>
      </div>

      <div style={right(isMobile)}>
        <span>Chat on WhatsApp</span>
        <span style={{ marginLeft: "8px" }}>→</span>
      </div>
    </a>
  )
}

export default WhatsAppBar


/* ===== STYLES ===== */

const wrapper = (isMobile) => ({
  position: "fixed",
  top: isMobile ? "80px" : "120px", // tighter to navbar
  left: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: isMobile ? "8px 12px" : "12px 20px", // 🔥 smaller
  height: isMobile ? "44px" : "auto",           // 🔥 force compact height

  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(12px)",

  borderBottom: "1px solid rgba(255,255,255,0.3)",
  borderLeft: "3px solid #22c55e",

  zIndex: 1000
})
const left = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#111827",
  fontWeight: "600"
}

const right = (isMobile) => ({
  display: "flex",
  alignItems: "center",
  color: "#16a34a",
  fontWeight: "500",
  fontSize: isMobile ? "12px" : "14px",
  gap: "4px"
})
const text = (isMobile) => ({
  fontSize: isMobile ? "12px" : "15px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: isMobile ? "120px" : "none" // 🔥 tighter
})

const iconCircle = {
  background: "#2ecc71",
  color: "white",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}
