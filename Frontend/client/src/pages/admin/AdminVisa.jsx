import { useEffect, useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import API from "../../api"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"


function AdminVisa() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [visas, setVisas] = useState([])
  const [selected, setSelected] = useState(null)
  const { user, loading: authLoading } = useContext(AuthContext)
  const [notes, setNotes] = useState({})
  const [adminBiometricDates, setAdminBiometricDates] = useState({})
const [loading, setLoading] = useState({})
  const [statusMessages, setStatusMessages] = useState({}) // inline messages

  useEffect(() => {
  if (!authLoading && user) {
    fetchData()
  }
}, [authLoading, user])
  useEffect(() => {
  if (filteredVisas.length > 0) {
    setSelected(filteredVisas[0])
  }
}, [search])
 

  const handleNoteChange = (stageId, value) => {
    setNotes(prev => ({ ...prev, [stageId]: value }))
  }

  const updateStage = async (
  stageId,
  status = null,
  message = "Updated!",
  extra = {},
  action = "updating"
) => {
  try {
    setLoading(prev => ({
      ...prev,
      [stageId]: { ...prev[stageId], [action]: true }
    }))
      setVisas(prev =>
  prev.map(v => {
    if (v.id !== selected?.id) return v

    return {
      ...v,
      stages: v.stages.map(s =>
        s.id === stageId
          ? { ...s, ...(status && { status }), ...extra }
          : s
      )
    }
  })
)
      setStatusMessages(prev => ({ ...prev, [stageId]: message }))
      await fetchData()
    } catch (err) {
      setStatusMessages(prev => ({ ...prev, [stageId]: "Update failed" }))
      console.error(err)
    } finally {
      setLoading(prev => ({
  ...prev,
  [stageId]: { ...prev[stageId], [action]: false }
}))
      setTimeout(() => setStatusMessages(prev => ({ ...prev, [stageId]: "" })), 3000)
    }
  }

  const fetchData = async () => {
    const res = await API.get("visa-applications/")
    const data = res.data.results || res.data
    setVisas(data)
const savedId = localStorage.getItem("selectedVisaId")

setSelected(
  data.find(v => v.id === Number(savedId)) ||
  data.find(v => v.id === selected?.id) ||
  data[0]
)  }

  const uploadDoc = async (stageId, file) => {
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    fd.append("stage", stageId)
    try {
      await API.post("visa-upload/", fd)
      setStatusMessages(prev => ({ ...prev, [stageId]: "File uploaded!" }))
      await fetchData()
    } catch (err) {
      setStatusMessages(prev => ({ ...prev, [stageId]: "Upload failed" }))
      console.error(err)
    } finally {
      setTimeout(() => setStatusMessages(prev => ({ ...prev, [stageId]: "" })), 3000)
    }
  }
  const filteredVisas = visas.filter(v =>
  v.applicant_name?.toLowerCase().includes(search.toLowerCase()) ||
  v.email?.toLowerCase().includes(search.toLowerCase()) ||
  v.job_title?.toLowerCase().includes(search.toLowerCase())
)

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
  <input
    type="text"
    placeholder="Search by name, email, job..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        setSearch(searchInput)
      }
    }}
    style={{
      flex: 1,
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ddd"
    }}
  />

  <button
    onClick={() => setSearch(searchInput)}
    style={{
      padding: "8px 12px",
      background: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Search
  </button>
  
</div>
        {filteredVisas.map(v => (
          <div
            key={v.id}
            style={{
              ...styles.userItem,
              background: selected?.id === v.id ? "#e3f2fd" : "transparent",
border: selected?.id === v.id ? "1px solid #3498db" : "1px solid transparent"
            }}
            onClick={() => {
              setSelected(v)
              localStorage.setItem("selectedVisaId", v.id)
              setNotes({})
            }}
          >
            <strong>{v.applicant_name}</strong>
            <p style={{ fontSize: "12px", color: "#666" }}>{v.job_title}</p>
            <p style={{ fontSize: "11px", color: "#999" }}>{v.email}</p>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {!selected && <p>Select a visa</p>}

        {selected && (
          <>
            <div style={{ marginBottom: "15px" }}>
  <h2 style={{ margin: 0 }}>{selected.applicant_name}</h2>
  <p style={{ color: "#666", margin: "4px 0" }}>{selected.job_title}</p>
  <span style={{ fontSize: "12px", color: "#999" }}>{selected.email}</span>
</div>
            

            {selected.stages.map(stage => (
              <div key={stage.id} style={styles.card}>
                <h4>{stage.name || stage.key.replaceAll("_", " ")}</h4>
                <div style={styles.statusRow}>
  <span>Status:</span>
  <span style={{
    ...styles.statusBadge,
    background:
      stage.status === "completed" ? "#e8f8f5" :
      stage.status === "declined" ? "#fdecea" :
      "#fff8e1",
    color:
      stage.status === "completed" ? "#27ae60" :
      stage.status === "declined" ? "#e74c3c" :
      "#f39c12"
  }}>
    {stage.status}
  </span>
</div>

                {/* ===== DISPLAY USER BOOKINGS ===== */}
                {stage.key === "biometrics" && stage.biometrics_booking_date && (
                  <div style={{ marginTop: "8px", color: "#f39c12" }}>
                    <p>📅 Biometrics booked for: <strong>{stage.biometrics_booking_date}</strong></p>

                    {/* ADMIN APPROVE / DECLINE */}
                    {stage.status !== "completed" && stage.status !== "declined" && (
                      <div style={styles.buttonGroup}>
                        <button
                          style={{ ...styles.successBtn, background: "#2ecc71" }}
                          disabled={loading[stage.id]?.saving}
                          onClick={() => updateStage(stage.id, "completed", "Approved!", {
  biometrics_status: "approved"
})}
                        >
                          Approve
                        </button>
                        <button
                          style={{ ...styles.dangerBtn, background: "#e74c3c", marginLeft: "10px" }}
                          disabled={loading[stage.id]?.saving}
                          onClick={() => updateStage(stage.id, "declined", "Declined!", {
  biometrics_status: "rejected"
})}
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* USER FEEDBACK */}
                    {stage.status === "completed" && stage.decision === "approved" && (
                      <p style={{ color: "#27ae60", fontWeight: 600 }}>✅ Approved</p>
                    )}
                    {stage.status === "declined" && (
  <div style={{ marginTop: "10px", background: "#fff3f3", padding: "10px", borderRadius: "6px" }}>
    
    <p style={{ color: "#e74c3c", fontWeight: "600" }}>
      ❌ Booking Declined — Assign New Date
    </p>

    <input
      type="date"
      value={adminBiometricDates[stage.id] || ""}
      min={stage.biometrics_booking_date} // 🔥 only future dates
      onChange={(e) =>
        setAdminBiometricDates(prev => ({
          ...prev,
          [stage.id]: e.target.value
        }))
      }
    />

    <button
      style={{ ...styles.primaryBtn, marginTop: "8px" }}
      onClick={() =>
        updateStage(stage.id, null, "New biometrics date assigned", {
          biometrics_booking_date: adminBiometricDates[stage.id],
          biometrics_status: "approved",
          status: "in_progress" // 🔥 reopens stage
        })
      }
    >
      Set New Date
    </button>
  </div>
)}
                  </div>
                )}

                {stage.key === "medical" &&
 stage.medical_booking_date &&
 !stage.uploads?.some(u => !u.uploaded_by_admin) && 
 stage.status !== "completed" && (
                  <p style={{ marginTop: "8px", color: "#f39c12" }}>
                    📅 Medical booked for: <strong>{stage.medical_booking_date}</strong>
                  </p>
                )}
                {stage.key === "medical" && stage.uploads?.some(u => !u.uploaded_by_admin) && (
  <div style={{ marginTop: "10px", padding: "10px", background: "#eef6ff", borderRadius: "6px" }}>
    <p style={{ fontWeight: "600", color: "#3498db" }}>
      🏥 Uploaded Medical Report
    </p>

    {stage.uploads
      .filter(u => !u.uploaded_by_admin)
      .map(u => (
        <a
          key={u.id}
          href={u.file}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", marginTop: "5px" }}
        >
          📄 View Medical Report
        </a>
      ))}
  </div>
)}
{stage.key === "medical" &&
 stage.uploads?.some(u => !u.uploaded_by_admin) &&
 stage.status !== "completed" && (
  <div style={styles.buttonGroup}>
    <button
      style={{ ...styles.successBtn, background: "#2ecc71" }}
      onClick={() =>
        updateStage(stage.id, null, "Medical report approved", {
          medical_status: "approved"
        })
      }
    >
      Approve Report
    </button>

    <button
      style={{ ...styles.dangerBtn, background: "#e74c3c", marginLeft: "10px" }}
      onClick={() =>
        updateStage(stage.id, null, "Medical report rejected", {
          medical_status: "rejected"
        })
      }
    >
      Reject Report
    </button>
  </div>
)}
{stage.key === "medical" && stage.medical_status === "approved" && (
  <p style={{ color: "#2ecc71", fontWeight: "600", marginTop: "10px" }}>
    ✅ Medical Report Approved
  </p>
)}

{stage.key === "medical" && stage.medical_status === "rejected" && (
  <p style={{ color: "#e74c3c", fontWeight: "600", marginTop: "10px" }}>
    ❌ Medical Report Rejected
  </p>
)}

                {/* NOTES EDITOR */}
                <div style={{ marginBottom: "10px" }}>
                  <ReactQuill
                    theme="snow"
                    value={notes[stage.id] ?? stage.notes ?? ""}
                    onChange={value => handleNoteChange(stage.id, value)}
                    placeholder="Add notes for user..."
                  />
                </div>

                {/* SAVE NOTES */}
                <button
                  style={styles.primaryBtn}
                  onClick={() => updateStage(stage.id, null, "Notes saved!")}
                  disabled={loading[stage.id]?.saving}
                >
                  {loading[stage.id]?.saving ? "Saving..." : "Save Notes"}
                </button>
                {statusMessages[stage.id] && <span style={styles.inlineMsg}>{statusMessages[stage.id]}</span>}

                {/* COMPLETE BUTTON */}
                {stage.status !== "completed" && stage.key !== "decision" && stage.status !== "declined" && (
                  <button
                    style={styles.completeBtn}
                    onClick={() => updateStage(stage.id, "completed", "Stage marked complete!")}
                    disabled={loading[stage.id]?.updating}
                  >
                    {loading[stage.id]?.updating ? "Processing..." : "Mark Complete"}
                  </button>
                )}
                {stage.medical_booking_date && stage.status !== "completed" && (
  <button
    style={{ ...styles.completeBtn, background: "#2ecc71" }}
    onClick={() =>
      updateStage(stage.id, "completed", "Medical Approved")
    }
  >
    Approve Medical
  </button>
)}

                {stage.status === "completed" && stage.decision_status && <span style={styles.completedBadge}>✅ Completed</span>}

                {/* ===== STAGE-SPECIFIC ACTIONS ===== */}
                {stage.key === "job_offer" && (
  <>
    {/* ========================= */}
    {/* ADMIN UPLOAD */}
    {/* ========================= */}
    <p><strong>Upload Offer Letter</strong></p>
    <input type="file" onChange={e => uploadDoc(stage.id, e.target.files[0])} />

    {/* ========================= */}
    {/* SHOW ADMIN DOCUMENT */}
    {/* ========================= */}
    {stage.uploads?.filter(u => u.uploaded_by_admin).map(u => (
      <div key={u.id} style={{ marginTop: "10px" }}>
        <p style={{ fontSize: "12px", color: "#666" }}>Admin Document</p>
        <a href={u.file} target="_blank" rel="noopener noreferrer">
          📄 View Job Offer Letter
        </a>
      </div>
    ))}

    {/* ========================= */}
    {/* SHOW USER SIGNED DOC */}
    {/* ========================= */}
    {stage.uploads?.filter(u => !u.uploaded_by_admin).length > 0 && (
      <div style={{ marginTop: "15px", padding: "10px", background: "#fff8e1", borderRadius: "6px" }}>
        <p style={{ fontWeight: "600", color: "#f39c12" }}>
          User Signed Document
        </p>

        {stage.uploads
          .filter(u => !u.uploaded_by_admin)
          .map(u => (
            <a
              key={u.id}
              href={u.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", marginTop: "5px" }}
            >
              📄 Download Signed Document
            </a>
          ))}
      </div>
    )}

    {/* ========================= */}
    {/* REVIEW BUTTON */}
    {/* ========================= */}
    {stage.uploads?.some(u => !u.uploaded_by_admin) && stage.status !== "completed" && (
      <button
        style={{ ...styles.completeBtn, background: "#2ecc71", marginTop: "10px" }}
        disabled={loading[stage.id]?.saving}
        onClick={() =>
          updateStage(stage.id, "completed", "Job offer approved!")
        }
      >
        Approve Signed Offer
      </button>
    )}

    {/* ========================= */}
    {/* APPROVED STATE */}
    {/* ========================= */}
    {stage.status === "completed" && (
      <p style={{ color: "#2ecc71", fontWeight: "600", marginTop: "10px" }}>
        ✅ Offer reviewed and approved
      </p>
    )}
  </>
)}

                {stage.key === "work_permit" && (
                  <>
                    <p>Upload Work Permit Forms</p>
                    <input type="file" onChange={e => uploadDoc(stage.id, e.target.files[0])} />
                  </>
                )}
               {stage.key === "lmia" && (
  <>
    {/* ========================= */}
    {/* PAYMENT STATUS */}
    {/* ========================= */}
    <p>
      Payment Status:{" "}
      <strong>
        {stage.lmia_payment_status === "paid" ? "✅ Paid" : "❌ Not Paid"}
      </strong>
    </p>

    {/* ========================= */}
    {/* ADMIN PAYMENT ACTION */}
    {/* ========================= */}
    {stage.lmia_payment_status !== "paid" && (
      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.successBtn, background: "#2ecc71" }}
          onClick={() =>
            updateStage(stage.id, null, "Payment confirmed", {
              lmia_payment_status: "paid"
            })
          }
        >
          Approve Payment
        </button>

        <button
          style={{ ...styles.dangerBtn, background: "#e74c3c", marginLeft: "10px" }}
          onClick={() =>
            updateStage(stage.id, "declined", "Payment declined", {
              lmia_payment_status: "pending"
            })
          }
        >
          Decline Payment
        </button>
      </div>
    )}

    {/* ========================= */}
    {/* UPLOAD ALWAYS AVAILABLE */}
    {/* ========================= */}
    <div style={{ marginTop: "15px" }}>
      <p><strong>Upload LMIA Certificate</strong></p>
      <input type="file" onChange={e => uploadDoc(stage.id, e.target.files[0])} />
    </div>

    {/* ========================= */}
    {/* SHOW CERTIFICATE */}
    {/* ========================= */}
    {stage.uploads?.filter(u => u.uploaded_by_admin).map(u => (
      <div key={u.id} style={{ marginTop: "10px" }}>
        <a href={u.file} target="_blank" rel="noopener noreferrer">
          📄 View LMIA Certificate
        </a>
      </div>
    ))}

    {/* ========================= */}
    {/* FINAL APPROVAL */}
    {/* ========================= */}
    {stage.lmia_payment_status === "paid" && stage.status !== "completed" && (
      <button
        style={{ ...styles.completeBtn, background: "#2ecc71", marginTop: "10px" }}
        onClick={() =>
          updateStage(stage.id, "completed", "LMIA Approved")
        }
      >
        Approve LMIA
      </button>
    )}

    {/* ========================= */}
    {/* STATES */}
    {/* ========================= */}
    {stage.status === "completed" && (
      <p style={{ color: "#2ecc71", fontWeight: "600", marginTop: "10px" }}>
        ✅ LMIA Approved
      </p>
    )}

    {stage.status === "declined" && (
      <p style={{ color: "#e74c3c", fontWeight: "600", marginTop: "10px" }}>
        ❌ LMIA Declined
      </p>
    )}
  </>
)}
{stage.key === "ielts" && (
  <>
    {/* ========================= */}
    {/* USER UPLOADED RESULTS */}
    {/* ========================= */}
    {stage.uploads?.filter(u => !u.uploaded_by_admin).length > 0 && (
      <div style={{ marginTop: "10px", padding: "10px", background: "#eef6ff", borderRadius: "6px" }}>
        <p style={{ fontWeight: "600", color: "#3498db" }}>
          📘 User IELTS Results
        </p>

        {stage.uploads
          .filter(u => !u.uploaded_by_admin)
          .map(u => (
            <a
              key={u.id}
              href={u.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", marginTop: "5px" }}
            >
              📄 View Uploaded Results
            </a>
          ))}
      </div>
    )}

    {/* ========================= */}
    {/* REVIEW BUTTONS */}
    {/* ========================= */}
    {stage.uploads?.some(u => !u.uploaded_by_admin) && stage.status !== "completed" && (
      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.successBtn, background: "#2ecc71" }}
          onClick={() =>
            updateStage(stage.id, "completed", "IELTS Approved")
          }
        >
          Approve Results
        </button>

        <button
          style={{ ...styles.dangerBtn, background: "#e74c3c", marginLeft: "10px" }}
          onClick={() =>
            updateStage(stage.id, "declined", "IELTS Rejected")
          }
        >
          Reject Results
        </button>
      </div>
    )}

    {/* ========================= */}
    {/* ADMIN CERTIFICATE UPLOAD */}
    {/* ========================= */}
    <div style={{ marginTop: "15px" }}>
      <p><strong>Upload IELTS Certificate</strong></p>
      <input type="file" onChange={e => uploadDoc(stage.id, e.target.files[0])} />
    </div>

    {/* ========================= */}
    {/* SHOW ADMIN CERTIFICATE */}
    {/* ========================= */}
    {stage.uploads?.filter(u => u.uploaded_by_admin).length > 0 && (
      <div style={{ marginTop: "10px", padding: "10px", background: "#e8f8f5", borderRadius: "6px" }}>
        <p style={{ fontWeight: "600", color: "#2ecc71" }}>
          🎓 IELTS Certificate
        </p>

        {stage.uploads
          .filter(u => u.uploaded_by_admin)
          .map(u => (
            <a
              key={u.id}
              href={u.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", marginTop: "5px" }}
            >
              📄 View Certificate
            </a>
          ))}
      </div>
    )}
  </>
)}
{stage.key === "visa_processing" && (
  <>
    {/* ========================= */}
    {/* PAYMENT STATUS */}
    {/* ========================= */}
    <p>
      Payment Status:{" "}
      <strong>
        {stage.visa_payment_status === "paid" ? "✅ Paid" : "❌ Not Paid"}
      </strong>
    </p>

    {/* ========================= */}
    {/* VERIFY PAYMENT (STAGE CONTROL) */}
    {/* ========================= */}
    {stage.visa_payment_status === "paid" && stage.status !== "completed" && (
      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.completeBtn, background: "#2ecc71" }}
          disabled={loading[stage.id]?.saving}
          onClick={() =>
            updateStage(stage.id, "in_progress", "Visa processing started")
          }
        >
          Verify & Start Processing
        </button>
      </div>
    )}

    {/* ========================= */}
    {/* BLOCK IF NOT PAID */}
    {/* ========================= */}
    {stage.visa_payment_status !== "paid" && (
      <p style={{ color: "#e74c3c", fontSize: "13px", marginTop: "10px" }}>
        Cannot proceed until visa fee is paid.
      </p>
    )}

    {/* ========================= */}
    {/* PROCESSING STATE */}
    {/* ========================= */}
    {stage.status === "in_progress" && (
      <p style={{ color: "#f39c12", fontWeight: "600", marginTop: "10px" }}>
        ⏳ Visa processing in progress
      </p>
    )}

    {/* ========================= */}
    {/* READY FOR DECISION */}
    {/* ========================= */}
    {stage.status === "completed" && (
      <p style={{ color: "#2ecc71", fontWeight: "600", marginTop: "10px" }}>
        ✅ Ready for final decision
      </p>
    )}
  </>
)}

                {stage.key === "decision" && (
  <>
    <button
      style={{ ...styles.completeBtn, background: "#2ecc71" }}
      disabled={loading[stage.id]?.saving}
      onClick={() =>
        updateStage(stage.id, "completed", "Visa Approved", {
          decision_status: "approved"
        })
      }
    >
      Approve
    </button>

    <button
      style={{ ...styles.completeBtn, background: "#e74c3c", marginLeft: "10px" }}
      disabled={loading[stage.id]?.saving}
      onClick={() =>
        updateStage(stage.id, "completed", "Visa Rejected", {
          decision_status: "rejected"
        })
      }
    >
      Reject
    </button>

    {/* FEEDBACK */}
    {stage.status === "completed" && (
  <>
    {stage.decision_status === "approved" && (
      <p style={{ marginTop: "10px", fontWeight: "600", color: "#2ecc71" }}>
        ✅ Visa Approved
      </p>
    )}

    {stage.decision_status === "rejected" && (
      <p style={{ marginTop: "10px", fontWeight: "600", color: "#e74c3c" }}>
        ❌ Visa Rejected
      </p>
    )}

    {!stage.decision_status && (
      <p style={{ marginTop: "10px", fontWeight: "600", color: "#f39c12" }}>
        ⏳ Decision updating...
      </p>
    )}
  </>
)}
  </>
)}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminVisa

const styles = {
  container: { display: "flex", padding: "20px" },
  sidebar: { width: "250px", borderRight: "1px solid #ddd", paddingRight: "10px" },
  userItem: {
  padding: "12px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  borderRadius: "8px",
  marginBottom: "6px",
  transition: "all 0.2s ease"
},
  main: { flex: 1, paddingLeft: "20px" },
  card: {
  marginTop: "15px",
  padding: "18px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  borderLeft: "4px solid #3498db"
},
  completeBtn: { marginTop: "10px", padding: "6px 10px", background: "#2ecc71", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  primaryBtn: { marginTop: "10px", padding: "8px", background: "#3498db", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  completedBadge: { display: "inline-block", marginTop: "10px", padding: "6px 10px", background: "#2ecc71", color: "white", borderRadius: "6px", fontSize: "12px" },
  inlineMsg: { marginLeft: "10px", fontSize: "12px", color: "#2c3e50" },
  successBtn: {
  padding: "6px 12px",
  background: "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.2s",
},
statusRow: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "10px"
},

statusBadge: {
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "capitalize"
},

dangerBtn: {
  padding: "6px 12px",
  background: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.2s",
},

secondaryBtn: {
  padding: "6px 12px",
  background: "#95a5a6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.2s",
},
buttonGroup: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr", // 2 per row
  gap: "13px", // spacing between buttons
  marginTop: "10px"
},
}