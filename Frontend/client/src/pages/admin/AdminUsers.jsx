import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import API from "../../api"

function AdminUsers() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [nextPage, setNextPage] = useState(null)
  const [prevPage, setPrevPage] = useState(null)

  const fetchUsers = async (url = null) => {
    try {
      setLoading(true)

      const endpoint = url
        ? url
        : search
        ? `users/admin/users/?search=${search}`
        : "users/admin/users/"

      const res = await API.get(endpoint)

      setUsers(res.data.results || res.data || [])
      setNextPage(res.data.next || null)
      setPrevPage(res.data.previous || null)

    } catch {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleActive = async (user) => {
    try {
      await API.patch(`users/admin/users/${user.id}/`, {
        is_active: !user.is_active
      })

      toast.success(user.is_active ? "User suspended" : "User activated")
      fetchUsers()

    } catch {
      toast.error("Failed to update user")
    }
  }

  if (loading) return <p>Loading users...</p>

  return (
    <div>

      {/* SEARCH BAR */}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

        <input
          style={searchInput}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button style={searchBtn} onClick={() => fetchUsers()}>
          Search
        </button>
        <button
  onClick={() => {
    setSearch("")
    fetchUsers()
  }}
  style={{
    background: "#ddd",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
Clear
</button>

      </div>

      {/* USERS TABLE */}

      <table style={table}>

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Last Login</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {(users || []).map(user => (
            <tr key={user.id}>

              <td>{user.full_name || "Unnamed"}</td>
              <td>{user.email}</td>
              <td>{user.is_staff ? "Admin" : "User"}</td>
              <td>{user.is_active ? "Active" : "Suspended"}</td>

              <td>
                {new Date(user.date_joined).toLocaleDateString()}
              </td>

              <td>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "Never"}
              </td>

              <td>

                <button
                  style={user.is_active ? suspendBtn : activateBtn}
                  onClick={() => toggleActive(user)}
                >
                  {user.is_active ? "Suspend" : "Activate"}
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* PAGINATION */}

      <div style={pagination}>

        <button
          disabled={!prevPage}
          onClick={() => fetchUsers(prevPage)}
        >
          Previous
        </button>

        <button
          disabled={!nextPage}
          onClick={() => fetchUsers(nextPage)}
        >
          Next
        </button>

      </div>

    </div>
  )
}

/* STYLES */

const searchInput = {
  flex: 1,
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px"
}

const searchBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer"
}

const table = {
  width: "100%",
  borderCollapse: "collapse"
}

const pagination = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-between"
}

const suspendBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
}

const activateBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
}

export default AdminUsers