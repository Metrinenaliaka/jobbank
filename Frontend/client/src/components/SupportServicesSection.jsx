function SupportServicesSection() {
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={heading}>Our Full Support Services</h2>

        <p style={subText}>
          Discover our exceptional services, meticulously crafted to cater
          to your travel desires and career ambitions in Canada.
        </p>

        <div style={servicesWrapper}>
          <div style={serviceCard}>
            <h4 style={serviceTitle}>Passport Applications</h4>
            <p style={serviceText}>
              Effortless assistance for acquiring or renewing passports.
            </p>
          </div>

          <div style={serviceCard}>
            <h4 style={serviceTitle}>Visa Applications</h4>
            <p style={serviceText}>
              Expert guidance to navigate complex visa requirements.
            </p>
          </div>
        </div>

        <div style={complianceCard}>
          <h3 style={complianceNumber}>100%</h3>
          <p style={complianceText}>COMPLIANCE RATE</p>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: "100px 20px",
  backgroundColor: "#ffffff",
}

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
}

const heading = {
  fontSize: "34px",
  fontWeight: "700",
  marginBottom: "15px",
  color: "#0f172a",
}

const subText = {
  maxWidth: "600px",
  marginBottom: "60px",
  color: "#475569",
  lineHeight: "1.7",
}

const servicesWrapper = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  marginBottom: "50px",
}

const serviceCard = {
  flex: "1",
  minWidth: "260px",
  backgroundColor: "#f1f5f9",
  padding: "30px",
  borderRadius: "16px",
}

const serviceTitle = {
  fontSize: "20px",
  marginBottom: "10px",
  fontWeight: "600",
  color: "#0f172a",
}

const serviceText = {
  fontSize: "15px",
  color: "#475569",
  lineHeight: "1.6",
}

const complianceCard = {
  backgroundColor: "#10b981",
  width: "260px",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  color: "white",
}

const complianceNumber = {
  fontSize: "48px",
  margin: "0",
}

const complianceText = {
  marginTop: "10px",
  letterSpacing: "2px",
}

export default SupportServicesSection