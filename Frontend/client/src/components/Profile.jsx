import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import API from "../api"
import { User, Bell, CreditCard, LogOut } from "lucide-react"

function Profile({ user, logout }) {
  const navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [profile, setProfile] = useState(null)

   useEffect(() => {
  const fetchUser = async () => {
    setLoading(true)

    try {
      const res = await API.get("users/me/")
      setProfile(res.data)
    } catch (err) {
      console.error("Failed to load profile", err)
    } finally {
      setLoading(false)
    }
  }

  fetchUser()
}, [])

  return (
    <div style={container}>

      <h2 style={title}>Profile</h2>

      {/* USER CARD */}
     <div style={card}>
  <div style={userRow}>

    {/* Avatar */}
    <div style={avatar}>
      {(profile?.full_name || user?.full_name)?.charAt(0) || "U"}
    </div>

    {/* Name + Email STACKED */}
    <div style={userInfo}>
      <div style={name}>
        {profile?.full_name || user?.full_name || "User"}
      </div>

      <div style={email}>
        {profile?.email || user?.email || "No email"}
      </div>
    </div>

    {/* Edit button */}
    {/* <button
      style={editBtn}
      onClick={() => navigate("/manage-account")}
    >
      Edit
    </button> */}

  </div>
</div>

      {/* MENU LIST */}
      <div style={card}>

        <MenuItem
          icon={<User size={18} />}
          title="Manage Account"
          subtitle="Edit your information & preferences"
          onClick={() => navigate("/manage-account")}
        />

        <MenuItem
          icon={<Bell size={18} />}
          title="Notifications"
          right={<Toggle />}
        />

        <MenuItem
          icon={<CreditCard size={18} />}
          title="Payment Methods"
          onClick={() => navigate("/payments")}
        />

      </div>

      {/* LOGOUT */}
      <div style={{ ...card, cursor: "pointer" }} onClick={logout}>
        <div style={{ ...menuRow, color: "#b91c1c" }}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>

    </div>
  )
}
function MenuItem({ icon, title, subtitle, right, onClick }) {
  return (
    <div style={menuItem} onClick={onClick}>
      <div style={menuLeft}>
        {icon}
        <div>
          <div>{title}</div>
          {subtitle && <div style={menuSub}>{subtitle}</div>}
        </div>
      </div>

      {right ? right : <span style={arrow}>›</span>}
    </div>
  )
}
function Toggle() {
  return (
    <div style={toggle}>
      <div style={toggleKnob}></div>
    </div>
  )
}

export default Profile

const container = {
  padding: "16px 12px",
  maxWidth: "600px",
  margin: "0 auto"
}
const userInfo = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flex: 1
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

const userRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
}

const avatar = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "rgba(34,197,94,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600"
}

const name = {
  fontWeight: "600"
}

const email = {
  fontSize: "13px",
  opacity: 0.6
}

const editBtn = {
  border: "1px solid rgba(0,0,0,0.1)",
  padding: "6px 10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px"
}

const menuItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  cursor: "pointer"
}

const menuLeft = {
  display: "flex",
  gap: "10px",
  alignItems: "center"
}

const menuSub = {
  fontSize: "12px",
  color: "#6b7280"
}

const menuRow = {
  display: "flex",
  gap: "10px",
  alignItems: "center"
}

const arrow = {
  opacity: 0.5,
  fontSize: "18px"
}

/* Toggle */

const toggle = {
  width: "40px",
  height: "22px",
  background: "#22c55e",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  padding: "2px"
}

const toggleKnob = {
  width: "18px",
  height: "18px",
  background: "#fff",
  borderRadius: "50%",
  marginLeft: "auto"
}