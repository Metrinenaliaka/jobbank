function StepsSection() {
  const isMobile = window.innerWidth <= 768

  return (
    <section style={sectionStyle(isMobile)}>
      <div style={container}>
        <h2 style={heading(isMobile)}>Simizi as one, two, three.</h2>

        <p style={subText(isMobile)}>
          It's easy to get started. Just tell us about your work experience
          and let Simizi take care of the rest.
        </p>

        <div style={stepsRow(isMobile)}>
          <Step number="1" text="Create a profile" isMobile={isMobile} />
          <Step number="2" text="Add your work history" isMobile={isMobile} />
          <Step number="3" text="Find your dream job" isMobile={isMobile} />
        </div>
      </div>
    </section>
  )
}

function Step({ number, text, isMobile }) {
  return (
    <div style={stepItem(isMobile)}>
      <div style={numberCircle}>
        {number}
      </div>

      <p style={stepText(isMobile)}>{text}</p>
    </div>
  )
}

/* ---------- STYLES ---------- */

const sectionStyle = (isMobile) => ({
  padding: isMobile ? "60px 16px" : "100px 0",
  background: "transparent",
})
const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  textAlign: "center",
  padding: "0 20px"
}

const heading = (isMobile) => ({
  fontSize: isMobile ? "26px" : "40px",
  fontWeight: "600",
  color: "#065f46",
  marginBottom: "15px"
})

const subText = (isMobile) => ({
  fontSize: isMobile ? "14px" : "18px",
  color: "#4a5568",
  maxWidth: "600px",
  margin: "0 auto",
  marginBottom: isMobile ? "40px" : "70px",
  lineHeight: "1.6"
})

const stepsRow = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row", // 🔥 key fix
  alignItems: "center",
  justifyContent: "center",
  gap: isMobile ? "35px" : "40px",
})

const stepItem = (isMobile) => ({
  flex: "1",
  maxWidth: "250px",
  textAlign: "center",
  padding: isMobile ? "10px" : "20px"
})

const numberStyle = {
  fontSize: "80px",
  fontWeight: "400",
  color: "#2ecc71",
  marginBottom: "15px"
}
const numberCircle = {
  width: "70px",
  height: "70px",
  margin: "0 auto 15px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "26px",
  fontWeight: "600",
  boxShadow: "0 10px 25px rgba(34,197,94,0.25)"
}

const stepText = (isMobile) => ({
  fontSize: isMobile ? "14px" : "16px",
  color: "#1f2937"
})

export default StepsSection