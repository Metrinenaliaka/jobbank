function StepsSection() {
  return (
    <section style={sectionStyle}>
      <div className="container">
        <h2 style={heading}>One, two, three's of Job Application</h2>

        <p style={{ textAlign: "center", marginBottom: "40px" }}>
          It's easy to get started. Just follow these simple steps and let us do the rest.
        </p>

        <div style={grid}>
          <Step number="1" text="Create a profile" />
          <Step number="2" text="Add your work history" />
          <Step number="3" text="Find your dream job" />
        </div>

      </div>
    </section>
  )
}

function Step({ number, text }) {
  return (
    <div style={stepCard}>
      <h3 style={{ color: "#2ecc71" }}>{number}</h3>
      <p>{text}</p>
    </div>
  )
}

const sectionStyle = {
  padding: "70px 0",
  background: "#eafff0"
}

const heading = {
  textAlign: "center",
  color: "#2ecc71",
  marginBottom: "10px"
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px"
}

const stepCard = {
  background: "white",
  padding: "30px",
  borderRadius: "8px",
  textAlign: "center"
}

export default StepsSection
