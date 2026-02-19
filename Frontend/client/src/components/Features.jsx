function FeaturesSection() {
  return (
    <section style={sectionStyle}>
      <div className="container">
        <h2 style={heading}>Put Us to work, for you.</h2>

        <p style={{ textAlign: "center", marginBottom: "40px" }}>
          Your designated assistant for all your job search needs wherever you are.
        </p>

        <div style={grid}>
          <FeatureCard text="Answer questions about Job Placements" />
          <FeatureCard text="Discover jobs tailored to your skills" />
          <FeatureCard text="Write resume and cover letters" />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ text }) {
  return (
    <div style={cardStyle}>
      <p>{text}</p>
    </div>
  )
}

const sectionStyle = {
  padding: "70px 0",
  background: "white"
}

const heading = {
  textAlign: "center",
  color: "#2ecc71",
  marginBottom: "10px"
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px"
}

const cardStyle = {
  background: "#f5fff7",
  padding: "30px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
}

export default FeaturesSection
