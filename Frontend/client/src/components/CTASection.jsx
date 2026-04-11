function CTASection({ openRegister }) {
  return (
    <section style={ctaStyle}>
      <div style={bgGlow} />
      <div style={glassCard}>
        <h2 style={{
  color: "#16a34a",
  fontSize: "28px",
  fontWeight: "700"
}}>
          Finding work shouldn't be a job.
        </h2>

        <p style={{ maxWidth: "700px", margin: "20px auto", color: "#374151",
fontSize: "15px",
lineHeight: "1.6"}}>
          Our Job is to find you a job. It's designed to make the process of finding and applying for jobs as easy as possible.
        </p>

        <button
  style={btnStyle}
  onClick={openRegister}
  onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0) scale(1)"
  }}
  onMouseDown={e => {
    e.currentTarget.style.transform = "scale(0.96)"
  }}
>
          Get Started
        </button>

      </div>
    </section>
  )
}

const ctaStyle = {
  padding: "100px 0",
  background: "transparent",
  position: "relative",
  overflow: "hidden"
}
const glassCard = {
  maxWidth: "750px",
  margin: "0 auto",
  padding: "50px 30px",
  textAlign: "center",

  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(25px)",
  WebkitBackdropFilter: "blur(25px)",

  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: `
    0 20px 60px rgba(34,197,94,0.12),
    0 0 80px rgba(34,197,94,0.08),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,

  position: "relative",
  zIndex: 2
}

const btnStyle = {
  marginTop: "20px",
  padding: "14px 28px",

  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "12px",

  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",

  boxShadow: `
    0 10px 25px rgba(34,197,94,0.35),
    0 0 35px rgba(34,197,94,0.25),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,

  transition: "all 0.25s ease"
}
const bgGlow = {
  position: "absolute",
  top: "-150px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "600px",
  height: "600px",
  background: "radial-gradient(circle, rgba(34,197,94,0.5), transparent 70%)",
  filter: "blur(120px)",
  zIndex: 0
}

export default CTASection