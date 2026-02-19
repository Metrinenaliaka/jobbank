function HeroSection() {
  return (
    <section style={heroStyle}>
      <div className="container">
        <h1 style={titleStyle}>
          The job search made simple and easy with AI.
        </h1>

        <p style={textStyle}>
          Simizi is your all-in-one AI tool for connecting employees with employers in Canada and beyond.
        </p>

        <button style={btnStyle}>Get Started</button>
      </div>
    </section>
  )
}

const heroStyle = {
  background: "#eafff0",
  padding: "80px 0",
  textAlign: "center"
}

const titleStyle = {
  fontSize: "42px",
  color: "#2ecc71",
  marginBottom: "20px"
}

const textStyle = {
  fontSize: "18px",
  maxWidth: "700px",
  margin: "auto",
  marginBottom: "30px"
}

const btnStyle = {
  padding: "14px 28px",
  background: "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
}

export default HeroSection
