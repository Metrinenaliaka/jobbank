import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import API from "../../api"

function AdminSupport() {

  const [activeTab, setActiveTab] = useState("chat")

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const [settings, setSettings] = useState({
    whatsapp_link: "",
    is_whatsapp_active: false
  })

  // =========================
  // FETCH SUPPORT
  // =========================
  const fetchTickets = async () => {
    try {
      const res = await API.get("support/")
      const data = res.data.results || res.data || []
      setTickets(data)
    } catch {
      toast.error("Failed to fetch support tickets")
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FETCH SETTINGS
  // =========================
  const fetchSettings = async () => {
    try {
      const res = await API.get("site-settings/")
      setSettings(res.data)
    } catch {
      toast.error("Failed to load site settings")
    }
  }

  useEffect(() => {
    fetchTickets()
    fetchSettings()
  }, [])

  // =========================
  // UPDATE TICKET
  // =========================
  const updateTicket = async (ticket, newStatus, response) => {
    try {
      await API.patch(`support/${ticket.id}/`, {
        status: newStatus,
        admin_response: response
      })
      fetchTickets()
    } catch {
      toast.error("Failed updating ticket")
    }
  }

  // =========================
  // UPDATE WHATSAPP
  // =========================
  const handleSettingsSave = async () => {
    try {
      await API.patch("site-settings/1/", settings)
      toast.success("WhatsApp settings updated")
    } catch (err) {
      toast.error(JSON.stringify(err.response?.data))
    }
  }

  if (loading) return <p style={{ padding: 30 }}>Loading...</p>

  return (
    <div style={wrapper}>

      <h2>Support Management</h2>

      {/* =========================
          TABS
      ========================== */}
      <div style={tabContainer}>
        <button
          style={activeTab === "chat" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("chat")}
        >
          Chat Support
        </button>

        <button
          style={activeTab === "whatsapp" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("whatsapp")}
        >
          WhatsApp Settings
        </button>
      </div>

      {/* =========================
          CHAT TAB
      ========================== */}
      {activeTab === "chat" && (
        <>
          <h3>Support Tickets</h3>

          {tickets.length === 0 && (
            <p>No support messages yet.</p>
          )}

          {tickets.map(ticket => (
            <div key={ticket.id} style={card}>
              <h4>{ticket.subject}</h4>
              <p><b>User:</b> {ticket.user_email}</p>
              <p><b>Message:</b> {ticket.message}</p>
              <p><b>Status:</b> {ticket.status}</p>

              <textarea
                style={textarea}
                defaultValue={ticket.admin_response}
                placeholder="Write admin response..."
                onBlur={(e) =>
                  updateTicket(
                    ticket,
                    ticket.status,
                    e.target.value
                  )
                }
              />

              <select
                value={ticket.status}
                onChange={(e) =>
                  updateTicket(
                    ticket,
                    e.target.value,
                    ticket.admin_response
                  )
                }
                style={select}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          ))}
        </>
      )}

      {/* =========================
          WHATSAPP TAB
      ========================== */}
      {activeTab === "whatsapp" && (
        <>
          <h3>WhatsApp Customer Service</h3>

          <div style={settingsCard}>
            <input
              style={input}
              placeholder="WhatsApp Link"
              value={settings.whatsapp_link || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsapp_link: e.target.value
                })
              }
            />

            <label style={checkboxRow}>
              Active
              <input
                type="checkbox"
                checked={settings.is_whatsapp_active || false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    is_whatsapp_active: e.target.checked
                  })
                }
              />
            </label>

            <button style={saveBtn} onClick={handleSettingsSave}>
              Save Settings
            </button>
          </div>
        </>
      )}

    </div>
  )
}

/* ===== STYLES ===== */

const wrapper = { padding: "0" }

const tabContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
}

const tabStyle = {
  padding: "8px 16px",
  border: "1px solid #ddd",
  background: "#f5f5f5",
  borderRadius: "6px",
  cursor: "pointer"
}

const activeTabStyle = {
  ...tabStyle,
  background: "#2ecc71",
  color: "white",
  border: "none"
}

const settingsCard = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ddd"
}

const input = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  marginBottom: "10px"
}

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px"
}

const saveBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer"
}

const card = {
  background: "white",
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px"
}

const textarea = {
  width: "100%",
  minHeight: "90px",
  marginTop: "10px",
  marginBottom: "10px",
  padding: "10px"
}

const select = {
  padding: "6px",
  width: "100%"
}

export default AdminSupport