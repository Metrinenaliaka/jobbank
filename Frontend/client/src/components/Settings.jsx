import { useState, useEffect } from "react"
import { Globe, Bell, Moon, Shield, HelpCircle } from "lucide-react"
import API from "../api"

function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("")
const [loading, setLoading] = useState(true)

const [frequency, setFrequency] = useState("")
const [showFreqModal, setShowFreqModal] = useState(false)

const frequencies = ["Daily", "Weekly", "Biweekly", "Monthly"]

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await API.get("users/me/")
      setLanguage(res.data.language || "English")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  fetchUser()
}, [])
useEffect(() => {
  const theme = darkMode ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", theme)

  localStorage.setItem("theme", theme)
}, [darkMode])
useEffect(() => {
  const saved = localStorage.getItem("theme")

  if (saved === "dark") {
    setDarkMode(true)
    document.documentElement.setAttribute("data-theme", "dark")
  }
}, [])

  return (
    <div style={container}>

      <h2 style={title}>Settings</h2>

      {/* LANGUAGE */}
      <div style={card}>
        <SettingItem
          icon={<Globe size={18} />}
          title="Language"
          subtitle="Selection"
          right={
    loading ? (
      <span style={valueText}>Loading...</span>
    ) : (
      <span style={valueText}>{language}</span>
    )
  }
        />
      </div>

      {/* ALERTS */}
      <div style={card}>
        <SettingItem
          icon={<Bell size={18} />}
          title="Job Alert Frequency"
          right={<span style={valueText}>Daily</span>}
        />

        <SettingItem
          icon={<Bell size={18} />}
          title="Notifications"
          right={
            <Toggle
              value={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          }
        />
      </div>

      {/* DISPLAY */}
      <div style={card}>
        <SettingItem
          icon={<Moon size={18} />}
          title="Dark Mode"
          right={
            <Toggle
              value={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
        />
      </div>

      {/* OTHER */}
      <div style={card}>
        <SettingItem
          icon={<Shield size={18} />}
          title="Privacy Settings"
        />

        <SettingItem
          icon={<HelpCircle size={18} />}
          title="Help & Support"
        />
      </div>

    </div>
  )
}
function SettingItem({ icon, title, subtitle, right }) {
  return (
    <div style={item}>
      <div style={left}>
        {icon}
        <div>
          <div>{title}</div>
          {subtitle && <div style={sub}>{subtitle}</div>}
        </div>
      </div>

      {right ? right : <span style={arrow}>›</span>}
    </div>
  )
}
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        ...toggle,
        background: value ? "#22c55e" : "#d1d5db"
      }}
    >
      <div
        style={{
          ...knob,
          marginLeft: value ? "auto" : "0"
        }}
      />
    </div>
  )
}

export default Settings

const container = {
  padding: "16px 12px",
  maxWidth: "600px",
  margin: "0 auto"
}

const title = {
  marginBottom: "16px"
}

const card = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(20px)",
  padding: "14px",
  borderRadius: "16px",
  marginBottom: "14px",
  border: "1px solid rgba(255,255,255,0.4)"
}

const item = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  cursor: "pointer"
}

const left = {
  display: "flex",
  gap: "10px",
  alignItems: "center"
}

const sub = {
  fontSize: "12px",
  color: "#6b7280"
}

const arrow = {
  opacity: 0.5,
  fontSize: "18px"
}

const valueText = {
  fontSize: "13px",
  color: "#6b7280"
}

/* Toggle */

const toggle = {
  width: "42px",
  height: "22px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  padding: "2px",
  cursor: "pointer",
  transition: "all 0.2s ease"
}

const knob = {
  width: "18px",
  height: "18px",
  background: "#fff",
  borderRadius: "50%",
  transition: "all 0.2s ease"
}