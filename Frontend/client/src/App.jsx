import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

import ResetPassword from "./pages/ResetPassword"
import Home from "./pages/Home"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import AdminJobs from "./pages/admin/AdminJobs"
import AdminRoute from "./components/AdminRoute"
import EmailVerified from "./pages/EmailVerified"
import WhatsAppBar from "./components/WhatsAppBar"
import ApplicationHistory from "./pages/ApplicationHistory"
import AdminApplications from "./pages/admin/AdminApplications"
import SupportChat from "./components/SupportChat"
import Navbar from "./components/Navbar"
import LoginModal from "./components/LoginModal"
import RegisterModal from "./components/RegisterModal"
import AdminSupport from "./pages/admin/AdminSupport"
import AdminLayout from "./pages/admin/AdminLayout"
import Resources from "./pages/Resources"
import VisaTracker from "./pages/VisaTracker"
import Profile from "./components/Profile"
import ProfileSettings from "./components/ProfileSettings"
import Settings from "./components/Settings"



function App() {

  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <BrowserRouter>

      <Navbar
  onLoginClick={() => setShowLogin(true)}
  onSignupClick={() => setShowSignup(true)}
/>
<div style={pageWrapper}>

  {/* <WhatsAppBar /> */}

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/jobs/:id" element={<JobDetail />} />
    <Route path="/applications" element={<ApplicationHistory />} />
    <Route path="/resources" element={<Resources />} />
    <Route path="/visa-tracker/:applicationId" element={<VisaTracker />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/email-verified" element={<EmailVerified />} />
    <Route path="/profile" element={<Profile />} />
<Route path="/manage-account" element={<ProfileSettings />} />
<Route path="/settings" element={<Settings />} />

    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route path="jobs" element={<AdminJobs />} />
      <Route path="applications" element={<AdminApplications />} />
      <Route path="support" element={<AdminSupport />} />
    </Route>
  </Routes>
</div>

      <SupportChat />
      <Toaster position="top-right" />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
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

const pageWrapper = {
  paddingTop: "150px"   // match navbar height
}