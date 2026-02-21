function CTASection({ openRegister }) {
  return (
    <section style={ctaStyle}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2 style={{ color: "#2ecc71" }}>
          Finding work shouldn't be a job.
        </h2>

        <p style={{ maxWidth: "700px", margin: "20px auto" }}>
          Our Job is to find you a job. It's designed to make the process of finding and applying for jobs as easy as possible.
        </p>

        <button style={btnStyle} onClick={openRegister}>
          Get Started
        </button>
      </div>
    </section>
  )
}

const ctaStyle = {
  padding: "80px 0",
  background: "white"
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

export default CTASection