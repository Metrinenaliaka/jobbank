import { useState } from "react"


import Footer from "../components/Footer"
import HeroSection from "../components/Hero"
import FeaturesSection from "../components/Features"
import StepsSection from "../components/Steps"
import CTASection from "../components/CTASection"
import RegisterModal from "../components/RegisterModal"

function Home() {
  const [showRegister, setShowRegister] = useState(false)

  const openRegister = () => {
    setShowRegister(true)
  }

  const closeRegister = () => {
    setShowRegister(false)
  }

  return (
    <>
      

      <HeroSection openRegister={openRegister} />
      <FeaturesSection />
      <StepsSection />
      <CTASection openRegister={openRegister} />

      {showRegister && (
        <RegisterModal
          onClose={closeRegister}
          onSwitchToLogin={() => {
            setShowRegister(false)
            // if you later add LoginModal, trigger it here
          }}
        />
      )}

      <Footer />
    </>
  )
}

export default Home