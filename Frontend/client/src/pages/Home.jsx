import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import HeroSection from "../components/Hero"
import FeaturesSection from "../components/Features"
import StepsSection from "../components/Steps"
import PlanSection from "../components/PlanSection"
import SupportServicesSection from "../components/SupportServicesSection"
import SupportStoryboardSection from "../components/SupportStoryboardSection"
import VisionMissionSection from "../components/VisionMissionSection"
import CTASection from "../components/CTASection"
import RegisterModal from "../components/RegisterModal"
import LoginModal from "../components/LoginModal"
import Footer from "../components/Footer"
import { AuthContext } from "../context/AuthContext"
import HomeSectionCarousel from "../components/HomeSectionCarousel"

function Home() {
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSupportChat, setShowSupportChat] = useState(false)
  useEffect(() => {
  document.title = "Simizi | Home"
}, [])
  

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleOpenSupportChat = () => {
  setShowSupportChat(true)
}


  const handlePrimaryAction = () => {
    if (user) {
      navigate("/jobs")
    } else {
      setShowRegister(true)
    }
  }

  const handleDocumentReview = () => {
    if (user) {
      navigate("/jobs") // change if you create a review page later
    } else {
      setShowRegister(true)
    }
  }

  return (
    <>
      {/* HERO */}
      <HeroSection openRegister={handlePrimaryAction} />

      {/* CORE FEATURES */}
      <FeaturesSection />

      {/* HOW IT WORKS */}
      <StepsSection />

     <HomeSectionCarousel
  onPrimaryAction={handlePrimaryAction}
  onOpenSupportChat={handleOpenSupportChat}
/>
      {/* FINAL CTA */}
      <CTASection openRegister={handlePrimaryAction} />

     

      {/* REGISTER MODAL */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
        />
      )}
      {showSupportChat && (
  <SupportChat onClose={() => setShowSupportChat(false)} />
)}
    </>
  )
  
}

export default Home
