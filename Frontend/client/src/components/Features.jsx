function FeaturesSection() {
  return (
    <section style={sectionStyle}>
      <div style={container}>
        <h2 style={heading}>Put Simizi to work, for you.</h2>

        <p style={subText}>
          Think of it like your personal AI assistant that can help you...
        </p>

        <div style={featuresRow}>
          <FeatureCard
            icon={<OverlapIcon />}
            text="Answer questions about Immigration"
          />
          <FeatureCard
            icon={<EyeIcon />}
            text="Discover jobs tailored to your skills"
          />
          <FeatureCard
            icon={<DocumentIcon />}
            text="Write resume and cover letters"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, text }) {
  return (
    <div style={featureItem}>
      <div style={iconWrapper}>
        {icon}
      </div>
      <p style={featureText}>{text}</p>
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

const sectionStyle = {
  padding: "100px 0",
  background: "#f3f4f6"
}

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  textAlign: "center",
  padding: "0 20px"
}

const heading = {
  fontSize: "42px",
  fontWeight: "500",
  color: "#2ecc71", // green headline
  marginBottom: "15px"
}

const subText = {
  color: "#4a5568",
  fontSize: "18px",
  marginBottom: "70px"
}

const featuresRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "40px",
  flexWrap: "wrap"
}

const featureItem = {
  flex: "1",
  minWidth: "250px"
}

const iconWrapper = {
  marginBottom: "25px"
}

const featureText = {
  fontSize: "18px",
  color: "#2d3748"
}

export default FeaturesSection