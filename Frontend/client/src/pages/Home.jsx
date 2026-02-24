import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import Footer from "../components/Footer"
import HeroSection from "../components/Hero"
import FeaturesSection from "../components/Features"
import StepsSection from "../components/Steps"
import CTASection from "../components/CTASection"
import RegisterModal from "../components/RegisterModal"
import { AuthContext } from "../context/AuthContext"

function Home() {
  const [showRegister, setShowRegister] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (user) {
      // User is logged in → go to jobs page
      navigate("/jobs")
    } else {
      // User not logged in → show register modal
      setShowRegister(true)
    }
  }

  const closeRegister = () => {
    setShowRegister(false)
  }

  return (
    <>
      <HeroSection openRegister={handleGetStarted} />
      <FeaturesSection />
      <StepsSection />
      <CTASection openRegister={handleGetStarted} />

      {showRegister && (
        <RegisterModal
          onClose={closeRegister}
          onSwitchToLogin={() => {
            setShowRegister(false)
            // if you later add LoginModal, trigger it here
          }}
        />
      )}
    </>
  )
}

export default Home