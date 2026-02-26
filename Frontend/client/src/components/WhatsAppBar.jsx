import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import API from "../api"

function WhatsAppBar() {

  const [settings, setSettings] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

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
        ...wrapper,
        background: isHovered ? "rgb(81, 141, 201)" : "#ffffff"
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <div style={left}>
        <div style={iconCircle}>
          <FaWhatsapp size={18} />
        </div>
        <span style={text}>Customer Service online 24/7</span>
      </div>

      <div style={right}>
        <span>Chat on WhatsApp</span>
        <span style={{ marginLeft: "8px" }}>→</span>
      </div>
    </a>
  )
}

export default WhatsAppBar


/* ===== STYLES ===== */

const wrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#ffffff",
  padding: "14px 24px",
  textDecoration: "none",
  borderBottom: "1px solid #e5e7eb",
  borderLeft: "5px solid #2ecc71",
  transition: "all 0.2s ease"
}

const left = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#111827",
  fontWeight: "600"
}

const right = {
  display: "flex",
  alignItems: "center",
  color: "#2ecc71",
  fontWeight: "500"
}

const text = {
  fontSize: "15px"
}

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