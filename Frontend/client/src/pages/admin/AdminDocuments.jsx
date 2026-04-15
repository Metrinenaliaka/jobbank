import { useEffect, useState } from "react"
import API from "../../api"

function AdminDocuments() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    console.log("🔥 AdminDocuments mounted")
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    console.log("🔥 fetchDocs called")
    try {
      const res = await API.get("admin-documents/")
      setDocs(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    await API.patch(`admin-documents/${id}/`, { status })
    fetchDocs()
  }

  if (loading) return <p style={styles.center}>Loading documents...</p>

  if (!docs.length)
    return <p style={styles.center}>No user documents yet</p>

const grouped = docs.reduce((acc, doc) => {
  const key = doc.user_email

  if (!acc[key]) {
    acc[key] = {
      name: doc.user_full_name,
      email: doc.user_email,
      docs: []
    }
  }

  acc[key].docs.push(doc)
  return acc
}, {})




const users = Object.values(grouped).filter(user =>
  user.name?.toLowerCase().includes(search.toLowerCase()) ||
  user.email?.toLowerCase().includes(search.toLowerCase())
)

return (
  <div style={styles.wrapper}>
    <h2 style={styles.title}>Document Verification</h2>

    {/* 🔍 SEARCH */}
    <div style={styles.searchBar}>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />
    </div>

    <div style={styles.container}>

      {/* 👥 USERS */}
      <div style={styles.sidebar}>
        {users.map(user => (
          <div
            key={user.email}
            onClick={() => setSelectedUser(user)}
            style={{
              ...styles.userItem,
              background:
                selectedUser?.email === user.email
                  ? "#e0f2fe"
                  : "transparent"
            }}
          >
            <p style={styles.userName}>{user.name}</p>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
        ))}
      </div>

      {/* 📄 DOCUMENTS */}
      <div style={styles.content}>
        {!selectedUser && (
          <p>Select a user to view documents</p>
        )}

        {selectedUser &&
          selectedUser.docs.map(doc => (
            <div key={doc.id} style={styles.card}>
              
              <div>
                <p style={styles.docTitle}>
                  {doc.document_type_name}
                </p>

                <span
                  style={{
                    ...styles.badge,
                    background:
                      doc.status === "verified"
                        ? "#dcfce7"
                        : doc.status === "rejected"
                        ? "#fee2e2"
                        : "#fef9c3"
                  }}
                >
                  {doc.status}
                </span>
              </div>

              <div style={styles.actions}>
                <a href={doc.file} target="_blank" style={styles.viewBtn}>
                  View
                </a>

                <button
                  style={styles.verify}
                  onClick={() => updateStatus(doc.id, "verified")}
                >
                  Verify
                </button>

                <button
                  style={styles.reject}
                  onClick={() => updateStatus(doc.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
)
}

export default AdminDocuments
const styles = {
  wrapper: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 16px"
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  center: {
    textAlign: "center",
    marginTop: "40px",
    color: "#6b7280"
  },

  card: {
    background: "rgba(255,255,255,0.7)",
    padding: "16px",
    borderRadius: "14px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(10px)"
  },

  user: {
    fontWeight: "600"
  },

  doc: {
    fontSize: "14px",
    color: "#374151"
  },

  status: {
    fontSize: "12px",
    color: "#6b7280"
  },

  actions: {
    display: "flex",
    gap: "10px"
  },

  viewBtn: {
    padding: "6px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#111827"
  },

  verify: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  reject: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  sidebar: {
    width: "250px",
    borderRight: "1px solid #eee",
    paddingRight: "10px"
  },
   userItem: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "5px"
  },
  content: {
    flex: 1
  },
  docTitle: {
    fontWeight: "600"
  },

   searchBar: {
    marginBottom: "15px"
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
    userName: {
    fontWeight: "600",
    fontSize: "14px"
  },

  userEmail: {
    fontSize: "12px",
    color: "#6b7280"
  },
    badge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    marginTop: "5px",
    display: "inline-block"
  },

}