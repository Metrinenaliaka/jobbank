import { useEffect, useState } from "react"
import API from "../../api"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"


function AdminVisa() {
  const [visas, setVisas] = useState([])
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState({})
  const [loadingStage, setLoadingStage] = useState(null)
  const [statusMessages, setStatusMessages] = useState({}) // inline messages

  useEffect(() => {
    fetchData()
  }, [])
 

  const handleNoteChange = (stageId, value) => {
    setNotes(prev => ({ ...prev, [stageId]: value }))
  }

  const updateStage = async (stageId, status = null, message = "Updated!", extra = {}) => {
    try {
      setLoadingStage(stageId)
      await API.patch(`visa-stage/${stageId}/update/`, {
        notes: notes[stageId],
        ...(status && { status }),
        ...extra
      })
      setStatusMessages(prev => ({ ...prev, [stageId]: message }))
      fetchData()
    } catch (err) {
      setStatusMessages(prev => ({ ...prev, [stageId]: "Update failed" }))
      console.error(err)
    } finally {
      setLoadingStage(null)
      setTimeout(() => setStatusMessages(prev => ({ ...prev, [stageId]: "" })), 3000)
    }
  }

  const fetchData = async () => {
    const res = await API.get("visa-applications/")
    const data = res.data.results || res.data
    setVisas(data)
    setSelected(data[0])
  }

  const uploadDoc = async (stageId, file) => {
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    fd.append("stage", stageId)
    try {
      await API.post("visa-upload/", fd)
      setStatusMessages(prev => ({ ...prev, [stageId]: "File uploaded!" }))
      fetchData()
    } catch (err) {
      setStatusMessages(prev => ({ ...prev, [stageId]: "Upload failed" }))
      console.error(err)
    } finally {
      setTimeout(() => setStatusMessages(prev => ({ ...prev, [stageId]: "" })), 3000)
    }
  }

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        {visas.map(v => (
          <div
            key={v.id}
            style={{
              ...styles.userItem,
              background: selected?.id === v.id ? "#eef6ff" : "transparent"
            }}
            onClick={() => {
              setSelected(v)
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
            <h3>{selected.applicant_name}</h3>
            <p style={{ color: "#666" }}>{selected.job_title}</p>

            {selected.stages.map(stage => (
              <div key={stage.id} style={styles.card}>
                <h4>{stage.name || stage.key.replaceAll("_", " ")}</h4>
                <p>
                  Status: <strong>{stage.status}</strong>
                </p>

                {/* ===== DISPLAY USER BOOKINGS ===== */}
                {stage.key === "biometrics" && stage.biometrics_booking_date && (
                  <div style={{ marginTop: "8px", color: "#f39c12" }}>
                    <p>📅 Biometrics booked for: <strong>{stage.biometrics_booking_date}</strong></p>

                    {/* ADMIN APPROVE / DECLINE */}
                    {stage.status !== "completed" && stage.status !== "declined" && (
                      <div style={{ marginTop: "6px" }}>
                        <button
                          style={{ ...styles.completeBtn, background: "#2ecc71" }}
                          disabled={loadingStage === stage.id}
                          onClick={() => updateStage(stage.id, "completed", "Approved!", {
  biometrics_status: "approved"
})}
                        >
                          Approve
                        </button>
                        <button
                          style={{ ...styles.completeBtn, background: "#e74c3c", marginLeft: "10px" }}
                          disabled={loadingStage === stage.id}
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
                    {stage.status === "declined" && stage.decision === "declined" && (
                      <div>
                        <p style={{ color: "#e74c3c", fontWeight: 600 }}>❌ Declined. Please rebook.</p>
                        <button
                          style={{ ...styles.primaryBtn, marginTop: "6px" }}
                          onClick={() => updateStage(stage.id, null, "Rebook requested!", { rebook: true })}
                        >
                          Rebook
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {stage.key === "medical" && stage.medical_booking_date && (
                  <p style={{ marginTop: "8px", color: "#f39c12" }}>
                    📅 Medical booked for: <strong>{stage.medical_booking_date}</strong>
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
                  disabled={loadingStage === stage.id}
                >
                  {loadingStage === stage.id ? "Saving..." : "Save Notes"}
                </button>
                {statusMessages[stage.id] && <span style={styles.inlineMsg}>{statusMessages[stage.id]}</span>}

                {/* COMPLETE BUTTON */}
                {stage.status !== "completed" && stage.key !== "decision" && stage.status !== "declined" && (
                  <button
                    style={styles.completeBtn}
                    onClick={() => updateStage(stage.id, "completed", "Stage marked complete!")}
                    disabled={loadingStage === stage.id}
                  >
                    {loadingStage === stage.id ? "Processing..." : "Mark Complete"}
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

                {stage.status === "completed" && <span style={styles.completedBadge}>✅ Completed</span>}

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
        disabled={loadingStage === stage.id}
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
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ ...styles.completeBtn, background: "#2ecc71" }}
          onClick={() =>
            updateStage(stage.id, null, "Payment confirmed", {
              lmia_payment_status: "paid"
            })
          }
        >
          Approve Payment
        </button>

        <button
          style={{ ...styles.completeBtn, background: "#e74c3c", marginLeft: "10px" }}
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
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ ...styles.completeBtn, background: "#2ecc71" }}
          onClick={() =>
            updateStage(stage.id, "completed", "IELTS Approved")
          }
        >
          Approve Results
        </button>

        <button
          style={{ ...styles.completeBtn, background: "#e74c3c", marginLeft: "10px" }}
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
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ ...styles.completeBtn, background: "#2ecc71" }}
          disabled={loadingStage === stage.id}
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
      disabled={loadingStage === stage.id}
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
      disabled={loadingStage === stage.id}
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
  userItem: { padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" },
  main: { flex: 1, paddingLeft: "20px" },
  card: { marginTop: "15px", padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  completeBtn: { marginTop: "10px", padding: "6px 10px", background: "#2ecc71", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  primaryBtn: { marginTop: "10px", padding: "8px", background: "#3498db", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  completedBadge: { display: "inline-block", marginTop: "10px", padding: "6px 10px", background: "#2ecc71", color: "white", borderRadius: "6px", fontSize: "12px" },
  inlineMsg: { marginLeft: "10px", fontSize: "12px", color: "#2c3e50" }
}