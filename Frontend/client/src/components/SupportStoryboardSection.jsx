function SupportStoryboardSection({ onReviewClick }) {
    
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <small style={tag}>SUPPORT STORYBOARD</small>

        <h2 style={heading}>
          Support that bridges passports to first shift
        </h2>

        <p style={text}>
          Every handoff from visa clarity to flight, transfer, and hotel
          is choreographed with transparent eligibility feedback,
          disciplined travel partners, and renewed hope kicked off
          in mountain cityscapes.
        </p>

        <button style={buttonStyle} onClick={onReviewClick}>
          REQUEST DOCUMENT REVIEW
        </button>
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: "110px 20px",
  backgroundColor: "transparent",
}

const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
}

const tag = {
  letterSpacing: "3px",
  fontSize: "12px",
  color: "#047857",
}

const heading = {
  fontSize: "40px",
  fontWeight: "700",
  margin: "20px 0",
  color: "#065f46",
}

const text = {
  fontSize: "17px",
  lineHeight: "1.8",
  maxWidth: "800px",
  color: "#065f46",
  marginBottom: "40px",
}

const buttonStyle = {
  backgroundColor: "#f97316",
  color: "white",
  padding: "14px 28px",
  borderRadius: "30px",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
}

export default SupportStoryboardSection