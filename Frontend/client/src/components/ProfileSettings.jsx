import { useState, useEffect } from "react"
import API from "../api"
import { User, Mail, Phone, MapPin, Key, Pencil } from "lucide-react"
import ChangePasswordModal from "./ChangePasswordModal"

function ProfileSettings({ user, onSave }) {
  // const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [success, setSuccess] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
const [saving, setSaving] = useState(false)
    const [editingField, setEditingField] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
const [justSaved, setJustSaved] = useState(null)
 

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await API.get("users/me/")
     
      
      setForm({
        full_name: res.data.full_name || "",
        email: res.data.email || "",
        phone_number: res.data.phone_number || "",
        nationality: res.data.nationality || ""
      })

    } catch (err) {
      console.error("Failed to load profile", err)
    } finally {
      setInitialLoading(false)
    }
  }

  fetchUser()
}, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    nationality: user?.nationality || ""
  })

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

 const handleSave = async () => {
  if (!editingField) return   // 🚨 guard

  setSaving(true)

  try {
    const field = editingField   // ✅ freeze value

    await API.patch("users/me/update/", {
      [field]: form[field]
    })

    setJustSaved(field)
    setEditingField(null)

    setTimeout(() => setJustSaved(null), 2000)
    console.log("Saving:", editingField, form[editingField])

  } catch (err) {
    console.error(err)
  } finally {
    setSaving(false)
  }
}
if (initialLoading) {
  return <div style={{ padding: "20px" }}>Loading profile...</div>
}
  return (
    <div style={container(isMobile)}>

      <h2 style={title}>Manage Account</h2>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div style={successBox}>
          {success}
        </div>
      )}

      {/* USER CARD */}
      <div style={card}>
        <div style={userRow(isMobile)}>
          <div style={avatar}>
            <IconWrapper>
  <User size={18} />
</IconWrapper>
            {user?.full_name?.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "600" }}>{form.full_name}</div>
            <div style={emailText}>{form.email}</div>
          </div>

         {/* <button
  style={editBtnSmall}
  onClick={() => onEdit()}
>
  {editable ? "Cancel" : "Edit"}
</button> */}
        </div>
      </div>

      {/* DETAILS */}
      <div style={card}>
        <Field
        icon={<User size={18} />}
  label="Name"
  value={form.full_name}
  editable={editingField === "full_name"}
  onEdit={() =>  setEditingField(
    editingField === "full_name" ? null : "full_name"
  )}
  justSaved={justSaved === "full_name"}
  onChange={(v) => handleChange("full_name", v)}
/>

        <Field
          icon={<Mail size={18} />}
          label="Email Address"
          value={form.email}
          editable={editingField === "email"}
          onEdit={() =>  setEditingField(
            editingField === "email" ? null : "email"
          )}
          onChange={(v) => handleChange("email", v)}
          justSaved={justSaved === "email"}
        />

        <Field
          icon={<Phone size={18} />}
          label="Phone Number"
          value={form.phone_number}
          editable={editingField === "phone_number"}
          onEdit={() =>  setEditingField(
            editingField === "phone_number" ? null : "phone_number"
          )}
          onChange={(v) => handleChange("phone_number", v)}
          justSaved={justSaved === "phone_number"}
        />

        <Field
          icon={<MapPin size={18} />}
          label="Location"
          value={form.nationality}
          editable={editingField === "nationality"}
          onEdit={() =>  setEditingField(
            editingField === "nationality" ? null : "nationality"
          )}
          onChange={(v) => handleChange("nationality", v)}
          justSaved={justSaved === "nationality"}
        />
      </div>

      {/* PASSWORD */}
      <div
        style={{ ...card, cursor: "pointer" }}
        onClick={() => setShowPasswordModal(true)}
      >
        <div style={fieldRow}>
          <div style={left}>
            <Key size={18} />
            <div>
              <div>Change Password</div>
              <div style={subText}>Update your password</div>
            </div>
          </div>
        </div>
      </div>
      {showPasswordModal && (
  <ChangePasswordModal
    onClose={() => setShowPasswordModal(false)}
  />
)}

      {/* SAVE */}
      {editingField && (
        <button
          style={saveBtn}
          onClick={handleSave}
          disabled={initialLoading || saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      )}

    </div>
  )
}

/* ================= FIELD ================= */

function Field({ icon, label, value, editable, onChange, onEdit, justSaved }) {
  return (
    <div style={fieldRow}>
      <div style={left}>
        {icon}
        <div>
          <div style={{ fontWeight: "500" }}>{label}</div>

          {editable ? (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={input}
            />
          ) : (
            <div style={subText}>{value || "-"}</div>
          )}
        </div>
      </div>

      {editable ? (
  <button style={cancelBtn} onClick={onEdit}>
    ✕
  </button>
) : (
  <button style={editBtnSmall} onClick={onEdit}>
    <Pencil size={14} />
  </button>
)}
      {justSaved && (
  <div style={successTick}>✓</div>
)}
    </div>
  )
}
function IconWrapper({ children }) {
  return (
    <div style={iconWrapper}>
      {children}
    </div>
  )
}

export default ProfileSettings

/* ================= STYLES ================= */

const container = (isMobile) => ({
  padding: isMobile ? "16px 12px" : "20px",
  maxWidth: "600px",
  margin: "0 auto"
})
const successTick = {
  color: "#16a34a",
  fontWeight: "bold",
  fontSize: "16px"
}
const iconWrapper = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "rgba(34,197,94,0.12)",   // soft green
  color: "#16a34a",

  flexShrink: 0
}

const title = {
  marginBottom: "16px"
}
const cancelBtn = {
  background: "rgba(239,68,68,0.1)",
  color: "#dc2626",
  border: "none",
  borderRadius: "8px",
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: "600"
}
const editBtnSmall = {
  fontSize: "12px",
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",

  background: "rgba(34,197,94,0.1)",
  color: "#16a34a",
  fontWeight: "500",

  display: "flex",
  alignItems: "center",
  gap: "4px",

  transition: "all 0.2s ease"
}
const card = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(20px)",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "16px",
  border: "1px solid rgba(255,255,255,0.4)"
}

const userRow = (isMobile) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexDirection: isMobile ? "row" : "row"
})

const avatar = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "rgba(34,197,94,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600"
}

const emailText = {
  fontSize: "13px",
  opacity: 0.6
}

const editBtn = {
  border: "1px solid rgba(0,0,0,0.1)",
  padding: "6px 10px",
  borderRadius: "8px",
  cursor: "pointer",
  whiteSpace: "nowrap"
}

const fieldRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid rgba(0,0,0,0.05)"
}

const left = {
  display: "flex",
  gap: "10px",
  alignItems: "center"
}

const subText = {
  fontSize: "13px",
  color: "#6b7280"
}

const input = {
  marginTop: "4px",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid rgba(0,0,0,0.1)",
  width: "100%"
}

const saveBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer"
}

const successBox = {
  background: "#ecfdf5",
  color: "#065f46",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
  fontSize: "13px"
}