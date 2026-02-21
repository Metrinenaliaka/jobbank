function Resources() {
  return (
    <section style={sectionStyle}>
      <div style={container}>
        <p style={introText}>
          From the latest job news to resume tips and tricks,
          keep up to date with the latest information.
        </p>

        <div style={grid}>
          <ResourceCard
            icon={<CircleSplitIcon />}
            title="Canadian Immigration & Citizenship News"
            text="Get the latest Canadian Immigration News"
          />

          <ResourceCard
            icon={<DiamondIcon />}
            title="Living Insights"
            text="Find out what it's like living in a specific Canadian city"
          />

          <ResourceCard
            icon={<GridIcon />}
            title="Resume Writing"
            text="Learn how to write an effective resume"
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
          />
        </div>
      </div>
    </section>
  )
}

function ResourceCard({ icon, title, text }) {
  return (
    <div style={card}>
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
  background: "#f3f4f6"
}

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 20px",
  textAlign: "center"
}

const introText = {
  fontSize: "18px",
  color: "#4a5568",
  maxWidth: "700px",
  margin: "0 auto 80px auto",
  lineHeight: "1.6"
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "40px"
}

const card = {
  background: "#eaecef",
  padding: "40px 30px",
  borderRadius: "25px",
  textAlign: "center",
  transition: "0.3s ease"
}

const iconWrapper = {
  marginBottom: "20px"
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

export default Resources