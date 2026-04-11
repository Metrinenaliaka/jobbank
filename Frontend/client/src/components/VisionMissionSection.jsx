function VisionMissionSection() {
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={grid}>
          <div style={card}>
            <h3 style={cardTitle}>Our Vision</h3>
            <p style={cardText}>
              To become a global leader in the travel industry,
              recognized for our commitment to excellence,
              sustainable practices, and enriching the lives
              of every adventurer we serve.
            </p>
          </div>

          <div style={card}>
            <h3 style={cardTitle}>Our Mission</h3>
            <p style={cardText}>
              Enrich lives through transformative travel experiences,
              connecting people with diverse cultures, fostering
              understanding, and creating cherished memories
              that last a lifetime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: "100px 20px",
  backgroundColor: "#transparent",
}

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
}

const grid = {
  display: "flex",
  gap: "40px",
  flexWrap: "wrap",
}

const card = {
  flex: "1",
  minWidth: "280px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
}

const cardTitle = {
  fontSize: "26px",
  marginBottom: "15px",
  fontWeight: "700",
  color: "#0f172a",
}

const cardText = {
  lineHeight: "1.7",
  color: "#475569",
}

export default VisionMissionSection