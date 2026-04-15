import { useEffect, useState } from "react"
import { FileText, CheckCircle, Clock, Upload, Trash2 } from "lucide-react"

import API from "../api"

function Documents() {
  const [types, setTypes] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobile = window.innerWidth < 768
  const [message, setMessage] = useState("")
const [actionLoading, setActionLoading] = useState(null)
const [deleteTarget, setDeleteTarget] = useState(null)
const styles = getStyles(isMobile)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
  try {
    const [typesRes, docsRes] = await Promise.all([
      API.get("document-types/"),
      API.get("documents/")
    ])

    setTypes(typesRes.data.results || typesRes.data)
    setDocuments(docsRes.data.results || docsRes.data)

  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

 const handleUpload = async (file, typeId) => {
  try {
    setMessage("Uploading document...")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("document_type", typeId)

    await API.post("documents/", formData)

    setMessage("Upload successful")
    fetchData()
  } catch (err) {
    setMessage("Upload failed")
  } finally {
    setTimeout(() => setMessage(""), 3000)
  }
}
 const handleDelete = async () => {
  if (!deleteTarget) return

  try {
    setActionLoading(deleteTarget)
    await API.delete(`documents/${deleteTarget}/`)
    setMessage("Document deleted successfully")
    setDeleteTarget(null)
    fetchData()
  } catch (err) {
    setMessage("Failed to delete document")
  } finally {
    setActionLoading(null)

    setTimeout(() => setMessage(""), 3000)
  }
}

  const getDoc = (typeId) =>
  documents.find(
    d => String(d.document_type) === String(typeId)
  )

  const required = types.filter(t => t.is_required)
  const verified = documents.filter(d => d.status === "verified")

  const progress = Math.round((verified.length / required.length) * 100)

  if (loading) return <p>Loading...</p>

  return (
  <>
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Documents</h2>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {/* Progress */}
      <div style={styles.progressCard}>
        <p>
          Documents Completion: {verified.length} / {required.length}
        </p>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      {/* List */}
      {types.map(type => {
        const doc = getDoc(type.id)
        const isVerified = doc?.status === "verified"
        const isPending = doc?.status === "pending"

        return (
          <div
            key={type.id}
            style={styles.card}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.15)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)"
            }}
          >
            {/* LEFT */}
            <div style={styles.left}>
              <FileText size={20} color="#16a34a" />

              <div>
                <p style={styles.docTitle}>{type.name}</p>

                {doc && (
                  <p style={styles.subText}>
                    Uploaded: {new Date(doc.uploaded_at).toDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div style={styles.right}>
              {isVerified && (
                <span style={styles.badgeVerified}>
                  <CheckCircle size={14} /> Verified
                </span>
              )}

              {isPending && (
                <span style={styles.badgePending}>
                  <Clock size={14} /> Pending
                </span>
              )}

              {doc ? (
                <>
                  <a href={doc.file} target="_blank" style={styles.viewBtn}>
                    View
                  </a>

                  <label style={styles.uploadBtn}>
                    <Upload size={14} />
                    Replace
                    <input
                      type="file"
                      hidden
                      onChange={e => handleUpload(e.target.files[0], type.id)}
                    />
                  </label>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => {
                      console.log("DELETE CLICKED", doc.id)
                      setDeleteTarget(doc.id)
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <label style={styles.uploadBtn}>
                  <Upload size={14} />
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={e => handleUpload(e.target.files[0], type.id)}
                  />
                </label>
              )}
            </div>
          </div>
        )
      })}
    </div>

    {/* ✅ MODAL MUST BE INSIDE RETURN */}
    {deleteTarget && (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <h3>Delete Document</h3>
          <p>Are you sure you want to delete this document?</p>

          <div style={styles.modalActions}>
            <button
              style={styles.cancelBtn}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>

            <button
              style={styles.confirmDelete}
              onClick={handleDelete}
              disabled={actionLoading === deleteTarget}
            >
              {actionLoading === deleteTarget ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)
  
}

export default Documents



const getStyles = (isMobile) => ({
  wrapper: {
    maxWidth: "720px",
    margin: "40px auto",
    padding: "0 16px"
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#065f46"
  },

  progressCard: {
    background: "rgba(255,255,255,0.6)",
    padding: "16px",
    borderRadius: "16px",
    marginBottom: "20px",
    backdropFilter: "blur(12px)"
  },
  message: {
  background: "#ecfdf5",
  color: "#065f46",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
  fontSize: "14px"
},

  progressBar: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    background: "#16a34a"
  },

  card: {
    background: "rgba(255,255,255,0.6)",
    padding: "16px",
    borderRadius: "16px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    
    backdropFilter: "blur(10px)",
    flexDirection: isMobile ? "column" : "row",
  alignItems: isMobile ? "flex-start" : "center",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
  },

  left: {
    display: "flex",
    gap: "12px",
    alignItems: "center"
  },
  deleteBtn: {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #dc2626",
  color: "#dc2626",
  background: "transparent",
  fontSize: "13px",
  cursor: "pointer",
  transition: "all 0.2s ease"
},

  icon: {
    fontSize: "22px"
  },

  docTitle: {
    fontWeight: "600"
  },

  subText: {
    fontSize: "12px",
    color: "#6b7280"
  },

  right: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    width: isMobile ? "100%" : "auto",
  justifyContent: isMobile ? "space-between" : "flex-end"
  },

  badgeVerified: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },

  badgePending: {
    background: "#fef9c3",
    color: "#92400e",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },

  viewBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    textDecoration: "none",
    color: "#111827",
    fontSize: "13px",
    transition: "all 0.2s ease"
  },

  uploadBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #16a34a",
    color: "#16a34a",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
},

modal: {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "300px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
},

modalActions: {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "15px"
},

cancelBtn: {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  background: "green",
  cursor: "pointer"
},

confirmDelete: {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#dc2626",
  color: "white",
  cursor: "pointer"
},
})
