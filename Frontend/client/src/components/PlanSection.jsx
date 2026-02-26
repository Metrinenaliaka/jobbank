function PlanSection() {
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={iconBox}>
            <span style={icon}>🗺️</span>
          </div>

          <h2 style={heading}>Our Plan</h2>

          <p style={text}>
            To curate innovative, tailor-made itineraries, blending expertise
            and creativity, ensuring seamless organization, and exceeding
            expectations, delivering unparalleled journeys to our valued travelers.
          </p>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: "100px 20px",
  backgroundColor: "#f8fafc",
}

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "50px",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
}

const iconBox = {
  width: "70px",
  height: "70px",
  backgroundColor: "#0f172a",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "25px",
}

const icon = {
  fontSize: "26px",
  color: "#ffffff",
}

const heading = {
  fontSize: "34px",
  fontWeight: "700",
  marginBottom: "20px",
  color: "#0f172a",
}

const text = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#475569",
}

export default PlanSection