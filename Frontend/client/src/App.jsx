import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import { Toaster } from "react-hot-toast"



import Home from "./pages/Home"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import AdminJobs from "./pages/admin/AdminJobs"
import AdminRoute from "./components/AdminRoute"
import ApplicationHistory from "./pages/ApplicationHistory"
import AdminApplications from "./pages/admin/AdminApplications"
import SupportChat from "./components/SupportChat"
import Navbar from "./components/Navbar"
import LoginModal from "./components/LoginModal"
import RegisterModal from "./components/RegisterModal"
import AdminSupport from "./pages/admin/AdminSupport"
import Resources from "./pages/Resources"

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
        <Route path="/applications" element={<ApplicationHistory />} />
        <Route path="/resources" element={<Resources />} />
        <Route
          path="/admin/jobs"
          element={
            <AdminRoute>
              <AdminJobs />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/support"
          element={
            <AdminRoute>
              <AdminSupport />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <AdminRoute>
              <AdminApplications />
            </AdminRoute>
          }
        />
      </Routes>

      <SupportChat />
      <Toaster position="top-right" />

      {/* ✅ POPUPS WITH SWITCH LOGIC */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
        />
      )}

      {showSignup && (
        <RegisterModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
        />
      )}

    </BrowserRouter>
  )
}

export default App