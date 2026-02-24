import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"

function Navbar({ onLoginClick, onSignupClick }) {

  const { user, logout } = useContext(AuthContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>

        {/* Left Spacer (for centering logo) */}
        <div style={{ width: "40px" }} />

        {/* Center Logo */}
        <Link to="/" style={logoStyle}>
          <h1 style={logoText}>Simizi</h1>
        </Link>

        {/* Desktop Menu */}
        {!isMobile ? (
          <div style={desktopMenu}>
            <NavLinks
              user={user}
              logout={logout}
              onLoginClick={onLoginClick}
              onSignupClick={onSignupClick}
            />
          </div>
        ) : (
          <div style={hamburgerStyle} onClick={toggleMenu}>
            ☰
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div style={mobileDropdown}>
          <NavLinks
            user={user}
            logout={logout}
            onLoginClick={onLoginClick}
            onSignupClick={onSignupClick}
            mobile
            closeMenu={() => setMenuOpen(false)}
          />
        </div>
      )}
    </nav>
  )
}

/* ===========================
   Reusable Nav Links
=========================== */

function NavLinks({ user, logout, onLoginClick, onSignupClick, mobile, closeMenu }) {

  const handleClick = () => {
    if (mobile && closeMenu) closeMenu()
  }

  return (
    <>
      <Link to="/jobs" style={mobile ? mobileLink : desktopLink} onClick={handleClick}>
        Jobs
      </Link>

      <Link to="/resources" style={mobile ? mobileLink : desktopLink} onClick={handleClick}>
        Resources
      </Link>

      {user && !user.is_staff && (
        <Link to="/applications" style={mobile ? mobileLink : desktopLink} onClick={handleClick}>
          Application History
        </Link>
      )}

      {user?.is_staff && (
        <Link to="/admin/jobs" style={adminLink} onClick={handleClick}>
          Admin Panel
        </Link>
      )}

      {!user ? (
        <>
          <button
            style={mobile ? mobileLoginBtn : desktopLoginBtn}
            onClick={() => { onLoginClick(); handleClick() }}
          >
            Log In
          </button>

          <button
            style={mobile ? mobileSignupBtn : desktopSignupBtn}
            onClick={() => { onSignupClick(); handleClick() }}
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          <span style={mobile ? mobileUser : desktopUser}>
            👤 {user.full_name}
          </span>

          <button
            style={mobile ? mobileSignupBtn : desktopSignupBtn}
            onClick={() => { logout(); handleClick() }}
          >
            Sign Out
          </button>
        </>
      )}
    </>
  )
}

/* ===========================
   Styles
=========================== */

const navStyle = {
  background: "#2ecc71",
  padding: "15px 20px",
  position: "relative"
}

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

const logoStyle = {
  textDecoration: "none",
  color: "white",
  textAlign: "center",
  flex: 1
}

const logoText = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "800",
  letterSpacing: "1px"
}

const desktopMenu = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
}

const hamburgerStyle = {
  fontSize: "28px",
  cursor: "pointer",
  color: "white"
}

const mobileDropdown = {
  position: "absolute",
  right: "20px",
  top: "75px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  minWidth: "220px",
  zIndex: 1000
}

/* Desktop Links */
const desktopLink = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500"
}

const adminLink = {
  background: "#27ae60",
  color: "white",
  padding: "6px 12px",
  borderRadius: "5px",
  textDecoration: "none",
  fontWeight: "600"
}

const desktopUser = {
  color: "white",
  fontWeight: "600"
}

const desktopLoginBtn = {
  padding: "8px 16px",
  border: "1px solid white",
  background: "transparent",
  color: "white",
  borderRadius: "4px",
  cursor: "pointer"
}

const desktopSignupBtn = {
  padding: "8px 16px",
  border: "none",
  background: "white",
  color: "#2ecc71",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600"
}

/* Mobile Styles */
const mobileLink = {
  color: "#333",
  textDecoration: "none",
  fontWeight: "500"
}

const mobileUser = {
  color: "#333",
  fontWeight: "600"
}

const mobileLoginBtn = {
  padding: "10px",
  border: "1px solid #2ecc71",
  background: "transparent",
  color: "#2ecc71",
  borderRadius: "5px",
  cursor: "pointer"
}

const mobileSignupBtn = {
  padding: "10px",
  border: "none",
  background: "#2ecc71",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600"
}

export default Navbar