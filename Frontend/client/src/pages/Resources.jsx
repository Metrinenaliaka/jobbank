import { useState } from "react"
function Resources() {
  const [showModal, setShowModal] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  return (
  <section style={sectionStyle}>
    <div style={container}>
      <div style={bgGlow} />
      <p style={introText}>
        From the latest job news to resume tips and tricks,
        keep up to date with the latest information.
      </p>

      <div style={grid}>
        <ResourceCard
          icon={<CircleSplitIcon />}
          title="Canadian Immigration & Citizenship News"
          text="Get the latest Canadian Immigration News"
          onClick={() => setActiveModal("immigration")}
        />

        <ResourceCard
          icon={<DiamondIcon />}
          title="Living Insights"
          text="Find out what it's like living in a specific Canadian city"
          onClick={() => setActiveModal("living")}
        />

        <ResourceCard
          icon={<GridIcon />}
          title="Resume Writing"
          text="Learn how to write an effective resume"
          onClick={() => window.location.href = "/jobs"}
        />

        <ResourceCard
          icon={<ChartIcon />}
          title="Language Skills"
          text="Master language skills for the Canadian workforce"
        />

        <ResourceCard
          icon={<WaveIcon />}
          title="Salary Outlook"
          text="Set your expectations for salary and cost of living in Canada"
        />

        <ResourceCard
          icon={<ClusterIcon />}
          title="Taxes & Finances"
          text="Navigate taxation and financial management in Canada"
          link="https://www.canada.ca/en/services/taxes.html"
        />
      </div>
    </div>

    {/* ✅ MODAL STARTS HERE */}
    {activeModal && (
      <div style={modalOverlay} onClick={() => setActiveModal(null)}>
        <div style={modal} onClick={(e) => e.stopPropagation()}>

          {activeModal === "living" && (
            <>
              <h2>Living Insights</h2>

              <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
{`Overview

Living Insights provides you with real-life guidance on what to expect when you move to Canada for work. This section helps you prepare beyond the job by giving you a clear understanding of daily life, cost of living, housing, transportation, culture, and weather conditions.

What you will find here

• Cost of living breakdown (rent, food, transport, utilities)
• Accommodation options and how to secure housing
• Transportation systems (buses, trains, driving rules)
• Weather and seasonal preparation (winter, summer, clothing)
• Workplace culture and expectations in Canada
• Basic laws, rights, and responsibilities for workers
• Banking, taxes, and managing your finances
• Healthcare system and insurance information
• Tips for settling in as a newcomer`}
              </p>
               <div style={modalActions}>
              <a
      href="https://www.canada.ca/en/services/immigration-citizenship/newcomers.html"
      target="_blank"
      rel="noopener noreferrer"
      style={modalLink}
    >
      Learn More About Living in Canada →
    </a>
    <button style={closeBtn} onClick={() => setActiveModal(null)}>
            Close
          </button>
        </div>
            </>
          )}

          {activeModal === "immigration" && (
            <>
              <h2>🇨🇦 Canadian Immigration & Citizenship News</h2>

              <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
{`Overview

At Simizi, we keep you updated with the latest immigration and citizenship changes in Canada. This section provides important updates that may affect your job application, visa process, or permanent residency plans.

Immigration rules and requirements can change at any time. That is why Simizi simplifies and brings you the most relevant updates in one place.

What You Will Find Here

• New immigration rules and policy changes
• Updates on work permits, study permits, and visas
• Express Entry and Permanent Residency updates
• Citizenship announcements
• Processing time changes

Why This Is Important

• Avoid delays or mistakes
• Prepare correct documents
• Act early on opportunities
• Plan with confidence`}
              </p>

    <div style={modalActions}>
              
              <a
     href="https://www.canada.ca/en/immigration-refugees-citizenship/news.html"
      target="_blank"
      rel="noopener noreferrer"
      style={modalLink}
    >
      View Latest Immigration Updates →
    </a>
     <button style={closeBtn} onClick={() => setActiveModal(null)}>
            Close
          </button>
        </div>
            </>
          )}

         

        </div>
      </div>
    )}
    {/* ✅ MODAL ENDS HERE */}

  </section>
)
}

function ResourceCard({ icon, title, text, link, onClick }) {

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (link) {
      window.open(link, "_blank")
    }
  }

  return (
    <div style={card} onClick={handleClick}
    onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"
    e.currentTarget.style.boxShadow = `
      0 25px 70px rgba(34,197,94,0.18),
      0 0 80px rgba(34,197,94,0.12),
      inset 0 1px 0 rgba(255,255,255,0.7)
    `
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0) scale(1)"
    e.currentTarget.style.boxShadow = `
      0 15px 50px rgba(34,197,94,0.10),
      0 0 60px rgba(34,197,94,0.06),
      inset 0 1px 0 rgba(255,255,255,0.6)
    `
  }}
  onTouchStart={e => {
  e.currentTarget.style.transform = "scale(0.97)"
}}

onTouchEnd={e => {
  e.currentTarget.style.transform = "scale(1)"
}}
    >
      <div style={iconWrapper}>{icon}</div>
      <h3 style={cardTitle}>{title}</h3>
      <p style={cardText}>{text}</p>
    </div>
  )
  
}
/* ---------------- ICONS ---------------- */

const green = "#2ecc71"
const dark = "#2d3748"

function CircleSplitIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="20" fill={green} />
      <rect x="30" y="10" width="20" height="40" fill="white" />
      <circle cx="30" cy="30" r="8" fill={dark} />
    </svg>
  )
}

function DiamondIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <polygon points="30,10 50,30 30,50 10,30" fill={green} />
      <circle cx="30" cy="30" r="8" fill={dark} />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      {[...Array(9)].map((_, i) => (
        <circle
          key={i}
          cx={18 + (i % 3) * 12}
          cy={18 + Math.floor(i / 3) * 12}
          r="4"
          fill={green}
        />
      ))}
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <rect x="15" y="30" width="10" height="15" fill={dark} />
      <rect x="30" y="20" width="10" height="25" fill={green} />
      <circle cx="20" cy="25" r="8" fill={dark} />
      <circle cx="35" cy="25" r="8" fill={green} />
    </svg>
  )
}

function WaveIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <path
        d="M10 40 Q20 20 30 40 T50 40"
        stroke={green}
        strokeWidth="6"
        fill="none"
      />
      <circle cx="15" cy="20" r="4" fill={dark} />
    </svg>
  )
}

function ClusterIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="20" cy="30" r="8" fill={green} />
      <circle cx="40" cy="30" r="8" fill="white" stroke={dark} strokeWidth="2" />
      <circle cx="30" cy="20" r="8" fill={green} />
      <circle cx="30" cy="40" r="8" fill="white" stroke={dark} strokeWidth="2" />
    </svg>
  )
}

/* ---------------- STYLES ---------------- */

const sectionStyle = {
  padding: "110px 0",
  background: "transparent"
}

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 20px",
  textAlign: "center",
  position: "relative",
  zIndex: 2
}
const modalActions = {
  marginTop: "25px",
  display: "flex",
  justifyContent: "space-between", // 👈 pushes them apart
  alignItems: "center",
  gap: "20px" // 👈 extra safety spacing
}

const introText = {
  fontSize: "18px",
  color: "#4a5568",
  maxWidth: "700px",
  margin: "0 auto 80px auto",
  lineHeight: "1.6"
}
const bgGlow = {
  position: "absolute",
  top: "-150px",
  left: "-150px",
  width: "500px",
  height: "500px",
  background: "radial-gradient(circle, rgba(34,197,94,0.5), transparent 70%)",
  filter: "blur(100px)",
  zIndex: 0
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "40px"
}

const card = {
  background: "rgba(255,255,255,0.08)",
backdropFilter: "blur(22px)",
WebkitBackdropFilter: "blur(22px)",

  padding: "40px 30px",
  borderRadius: "20px",
  textAlign: "center",

  border: "1px solid rgba(255,255,255,0.5)",

  boxShadow: `
    0 15px 50px rgba(34,197,94,0.10),
    0 0 60px rgba(34,197,94,0.06),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,
  backgroundImage: `
  linear-gradient(
    145deg,
    rgba(255,255,255,0.25),
    rgba(255,255,255,0.05)
  )
`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden"
}

const iconWrapper = {
  marginBottom: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  width: "70px",
  height: "70px",
  marginInline: "auto",

  borderRadius: "50%",

  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",

  boxShadow: `
    0 8px 20px rgba(34,197,94,0.15),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `
}

const cardTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: dark,
  marginBottom: "8px"
}

const cardText = {
  fontSize: "14px",
  color: "#4a5568"
}
const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
}

const modal = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  padding: "30px",

  boxShadow: `
    0 25px 60px rgba(0,0,0,0.25),
    0 0 40px rgba(34,197,94,0.08),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `
}
const modalLink = {
  display: "inline-block",
  marginTop: "20px",
  color: "#2ecc71",
  fontWeight: "600",
  textDecoration: "underline"
}
const closeBtn = {
  marginTop: "20px",
  padding: "10px 15px",
  border: "none",
  background: "#2ecc71",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer"
}

export default Resources