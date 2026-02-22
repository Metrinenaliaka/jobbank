import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import API from "../../api"

function AdminSupport() {

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // ===== FETCH =====
  const fetchTickets = async () => {
    try {
      const res = await API.get("support/")

      // DRF pagination safe
      const data = res.data.results || res.data || []

      setTickets(data)

    } catch (err) {
      console.log("Support fetch error:", err)
      toast.error("Failed to fetch support tickets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // ===== UPDATE =====
  const updateTicket = async (ticket, newStatus, response) => {
    try {
      await API.patch(`support/${ticket.id}/`, {
        status: newStatus,
        admin_response: response
      })

      fetchTickets()

    } catch (err) {
      console.log(err)
      toast.error("Failed updating ticket")
    }
  }

  if (loading) return <p style={{ padding: 30 }}>Loading support tickets...</p>

  return (
    <div style={wrapper}>
      <h2>Support Tickets</h2>

      {tickets.length === 0 && (
        <p>No support messages yet.</p>
      )}

      {tickets.map(ticket => (
        <div key={ticket.id} style={card}>

          <h3>{ticket.subject}</h3>

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
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

        </div>
      ))}
    </div>
  )
}

/* ===== STYLES ===== */

const wrapper = {
  maxWidth: "900px",
  margin: "40px auto",
  background: "white",
  padding: "25px",
  borderRadius: "10px"
}

const card = {
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

export default AdminSupport