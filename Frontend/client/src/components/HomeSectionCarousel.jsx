import { useState } from "react"

import PlanSection from "./PlanSection"
import SupportServicesSection from "./SupportServicesSection"
import SupportStoryboardSection from "./SupportStoryboardSection"
import VisionMissionSection from "./VisionMissionSection"

function HomeSectionCarousel({ onPrimaryAction, onOpenSupportChat }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  

  const slides = [
    <PlanSection key="plan" />,
    <SupportServicesSection key="services" />,
    <SupportStoryboardSection
      key="storyboard"
      onReviewClick={onPrimaryAction}
      onOpenSupportChat={onOpenSupportChat}
    />,
    <VisionMissionSection key="vision" />,
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    )
  }

  return (
    <section style={carouselSection}>
      <div style={carouselWrapper}>
        <div
          style={{
            ...sliderTrack,
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} style={slideStyle}>
              {slide}
            </div>
          ))}
        </div>

        {/* LEFT ARROW */}
        <button style={leftArrow} onClick={prevSlide}>
          ←
        </button>

        {/* RIGHT ARROW */}
        <button style={rightArrow} onClick={nextSlide}>
          →
        </button>
      </div>
    </section>
  )
}

/* ================= STYLES ================= */

const carouselSection = {
  position: "relative",
  overflow: "hidden",
}

const carouselWrapper = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
}

const sliderTrack = {
  display: "flex",
  transition: "transform 0.6s ease",
  width: "100%",
}

const slideStyle = {
  minWidth: "100%",
  flexShrink: 0,
}

const arrowBase = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "20px",
  transition: "all 0.3s ease",
  boxShadow: "0 0 20px rgba(255,255,255,0.6)"
}

const leftArrow = {
  ...arrowBase,
  left: "30px",
}

const rightArrow = {
  ...arrowBase,
  right: "30px",
}

export default HomeSectionCarousel