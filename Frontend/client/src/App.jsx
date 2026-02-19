import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import Home from "./pages/Home"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import AdminJobs from "./pages/admin/AdminJobs"

import Navbar from "./components/Navbar"
import LoginModal from "./components/LoginModal"
import RegisterModal from "./components/RegisterModal"

function App() {

  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <BrowserRouter>

      {/* 🔑 PASS FUNCTIONS HERE */}
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
      </Routes>

      {/* POPUPS */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      {showSignup && (
        <RegisterModal onClose={() => setShowSignup(false)} />
      )}

    </BrowserRouter>
  )
}

export default App
