import { useState, useEffect } from "react"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
function HeroSection({ openRegister }) {
  const isMobile = useIsMobile()

  return (
    <section style={heroStyle}>
      <div style={glassContainer(isMobile)}>
        <h1 style={titleStyle(isMobile)}>
          The job search made simple and easy with AI.
        </h1>

        <p style={textStyle(isMobile)}>
          Simizi is your all-in-one AI tool for connecting employees with employers in Canada and beyond.
        </p>

        <button
          style={btnStyle}
          onClick={openRegister}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(34,197,94,0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.3)"
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  )
}

const heroStyle = {
  padding: "80px 16px",
  textAlign: "center",
  position: "relative"
}
const glassContainer = (isMobile) => ({
  maxWidth: "720px",
  margin: "0 auto",
  padding: isMobile ? "24px 18px" : "40px",
  borderRadius: "20px",
  background: "transparent",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
})
const titleStyle = (isMobile) => ({
  fontSize: isMobile ? "28px" : "42px",
  fontWeight: "700",
  lineHeight: "1.3",
  color: "#065f46",
  marginBottom: "16px"
})

const textStyle = (isMobile) => ({
  fontSize: isMobile ? "14px" : "18px",
  color: "rgba(15,23,42,0.75)",
  marginBottom: "24px"
})

const btnStyle = {
  padding: "12px 26px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.25s ease",
  boxShadow: "0 10px 25px rgba(34,197,94,0.3)"
}

export default HeroSection