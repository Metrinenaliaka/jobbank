function FeaturesSection() {
  const isMobile = window.innerWidth <= 768
  return (
    <section style={sectionStyle(isMobile)}>
      <div style={bgGlow} />
      <div style={container}>
        <h2 style={heading(isMobile)}>Put Simizi to work, for you.</h2>

        <p style={subText}>
          Think of it like your personal AI assistant that can help you...
        </p>

        <div style={featuresRow}>
          <FeatureCard
            icon={<OverlapIcon />}
            text="Answer questions about Immigration"
            isMobile={isMobile}
          />
          <FeatureCard
            icon={<EyeIcon />}
            text="Discover jobs tailored to your skills"
            isMobile={isMobile}
          />
          <FeatureCard
            icon={<DocumentIcon />}
            text="Write resume and cover letters"
            isMobile={isMobile}
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, text, isMobile }) {
  return (
    <div
      style={featureItem(isMobile)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px) scale(1.03)"
        e.currentTarget.style.boxShadow = `
          0 25px 60px rgba(34,197,94,0.18),
          0 0 60px rgba(34,197,94,0.12),
          inset 0 1px 0 rgba(255,255,255,0.6)
        `
        const icon = e.currentTarget.querySelector("div")
  if (icon) icon.style.transform = "scale(1.1) rotate(2deg)"
  const el = e.currentTarget

  el.style.transform = "translateY(-10px) scale(1.03)"

  el.style.background = `
    linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)) padding-box,
    linear-gradient(135deg, #22c55e, #16a34a) border-box
  `

  el.style.border = "1px solid transparent"

  el.style.boxShadow = `
    0 25px 60px rgba(34,197,94,0.18),
    0 0 80px rgba(34,197,94,0.12)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)"
        e.currentTarget.style.boxShadow = `
          0 10px 30px rgba(34,197,94,0.08),
          inset 0 1px 0 rgba(255,255,255,0.5)
        `
        const icon = e.currentTarget.querySelector("div")
  if (icon) icon.style.transform = "scale(1.1) rotate(2deg)"
  const el = e.currentTarget

  el.style.transform = "translateY(0) scale(1)"

  el.style.background = "rgba(255,255,255,0.08)"

  el.style.border = "1px solid rgba(255,255,255,0.4)"

  el.style.boxShadow = `
    0 10px 30px rgba(34,197,94,0.08),
    inset 0 1px 0 rgba(255,255,255,0.5)
  `
      }}
    >
      <div style={iconWrapper}>
        <div style={{ transform: "scale(0.85)" }}>
        {icon}
        </div>
      </div>

      <p style={featureText(isMobile)}>{text}</p>
    </div>
  )
}
/* ---------- SVG ICONS ---------- */

function OverlapIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="50" cy="60" r="35" fill="#2ecc71" />
      <circle cx="75" cy="60" r="35" fill="none" stroke="#2d3748" strokeWidth="6" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <path
        d="M20 60 Q60 25 100 60 Q60 95 20 60 Z"
        fill="#2ecc71"
      />
      <circle cx="60" cy="60" r="14" fill="white" />
      <circle cx="60" cy="60" r="8" fill="#2d3748" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="55" cy="60" r="35" fill="#2ecc71" />
      <circle cx="75" cy="60" r="35" fill="#2d3748" />
      <rect x="58" y="42" width="30" height="6" fill="white" />
      <rect x="58" y="55" width="30" height="6" fill="white" />
      <rect x="58" y="68" width="30" height="6" fill="white" />
    </svg>
  )
}

/* ---------- STYLES ---------- */

const sectionStyle = (isMobile) => ({
  padding: isMobile ? "60px 15px" : "100px 0",
  background: "transparent",
  position: "relative",
  overflow: "hidden"
})

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  textAlign: "center",
  padding: "0 20px"
}

const heading = (isMobile) => ({
  fontSize: isMobile ? "28px" : "40px",
  lineHeight: isMobile ? "1.3" : "1.2",
  fontWeight: "700",
  color: "#16a34a",
  marginBottom: isMobile ? "10px" : "15px"
})

const subText = {
  color: "#4a5568",
  fontSize: "18px",
  marginBottom: "70px"
}

const featuresRow = {
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  flexWrap: "wrap"
}
const featureItem = (isMobile) => ({
  flex: "1 1 300px",
  minWidth: "250px",
  padding: isMobile ? "20px 15px" : "30px 20px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: `
    0 10px 30px rgba(34,197,94,0.08),
    inset 0 1px 0 rgba(255,255,255,0.5)
  `,
  transition: "all 0.3s ease",
  cursor: "pointer"
})

const iconWrapper = {
  marginBottom: "25px",
  transition: "transform 0.3s ease",
  animation: "floatIcon 4s ease-in-out infinite"
}

const featureText = (isMobile) => ({
  fontSize: isMobile ? "14px" : "16px",
  color: "#374151",
  lineHeight: "1.5"
})
const bgGlow = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "700px",
  height: "700px",
  background: "radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%)",
  filter: "blur(120px)",
  zIndex: 0
}

export default FeaturesSection