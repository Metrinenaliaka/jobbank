function StepsSection() {
  return (
    <section style={sectionStyle}>
      <div style={container}>
        <h2 style={heading}>Simizi as one, two, three.</h2>

        <p style={subText}>
          It's easy to get started. Just tell us about your work experience
          and let Simizi take care of the rest.
        </p>

        <div style={stepsRow}>
          <Step number="1." text="Create a profile" />
          <Step number="2." text="Add your work history" />
          <Step number="3." text="Find your dream job" />
        </div>
      </div>
    </section>
  )
}

function Step({ number, text }) {
  return (
    <div style={stepItem}>
      <div style={numberStyle}>{number}</div>
      <p style={stepText}>{text}</p>
    </div>
  )
}

/* ---------- STYLES ---------- */

const sectionStyle = {
  padding: "110px 0",
  background: "#f3f4f6" // light grey like image
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
  color: "#2ecc71", // green brand color
  marginBottom: "25px"
}

const subText = {
  fontSize: "18px",
  color: "#4a5568",
  maxWidth: "700px",
  margin: "0 auto 80px auto",
  lineHeight: "1.6"
}

const stepsRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "40px",
  flexWrap: "wrap"
}

const stepItem = {
  flex: "1",
  minWidth: "200px",
  textAlign: "center"
}

const numberStyle = {
  fontSize: "80px",
  fontWeight: "400",
  color: "#2ecc71",
  marginBottom: "15px"
}

const stepText = {
  fontSize: "18px",
  color: "#2d3748"
}

export default StepsSection