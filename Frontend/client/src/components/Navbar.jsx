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

  const logoSize = isMobile ? "36px" : "72px"

  return (
    <nav style={navStyle}>
      <div style={wrapper(isMobile)}>

        {/* LOGO */}
        <Link to="/" style={logoStyle}>
          <h1 style={{ ...logoText, fontSize: logoSize }}>simizi</h1>
        </Link>

        {/* DESKTOP MENU */}
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

      {/* MOBILE DROPDOWN */}
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
        <Link to="/admin/jobs" style={mobile ? adminLinkMobile : adminLink} onClick={handleClick}>
          Admin Panel
        </Link>
      )}

      {!user ? (
        <>
          <button
            style={mobile ? mobileBtn : desktopBtn}
            onClick={() => { onLoginClick(); handleClick() }}
          >
            Log In
          </button>

          <button
            style={mobile ? mobilePrimaryBtn : desktopPrimaryBtn}
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
            style={mobile ? mobilePrimaryBtn : desktopPrimaryBtn}
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
   STYLES
=========================== */

const navStyle = {
  background: "#f4f4f4",
  padding: "20px",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 1000
}

const wrapper = (isMobile) => ({
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  justifyContent: isMobile ? "center" : "space-between",
  alignItems: "center"
})

/* LOGO */

const logoStyle = {
  textDecoration: "none"
}

const logoText = {
  margin: 0,
  fontWeight: "800",
  letterSpacing: "2px",
  color: "#2ecc71",
  textTransform: "lowercase"
}

/* DESKTOP MENU */

const desktopMenu = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap"
}

const desktopLink = {
  background: "#e5e5e5",
  padding: "10px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#333",
  fontWeight: "500",
  fontSize: "15px"
}

const adminLink = {
  ...desktopLink,
  background: "#d5f5e3",
  color: "#27ae60",
  fontWeight: "600"
}

const desktopBtn = {
  background: "#e5e5e5",
  padding: "10px 22px",
  borderRadius: "12px",
  border: "none",
  fontSize: "15px",
  cursor: "pointer"
}

const desktopPrimaryBtn = {
  background: "#2ecc71",
  padding: "10px 22px",
  borderRadius: "12px",
  border: "none",
  fontSize: "15px",
  fontWeight: "600",
  color: "white",
  cursor: "pointer"
}

const desktopUser = {
  padding: "10px 22px",
  borderRadius: "12px",
  background: "#e5e5e5",
  fontWeight: "500"
}

/* MOBILE */

const hamburgerStyle = {
  fontSize: "32px",
  cursor: "pointer",
  padding: "5px 10px"
}

const mobileDropdown = {
  background: "white",
  marginTop: "20px",
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "90%",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
}

const mobileLink = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "500"
}

const adminLinkMobile = {
  color: "#27ae60",
  fontWeight: "600",
  textDecoration: "none"
}

const mobileUser = {
  fontWeight: "600"
}

const mobileBtn = {
  padding: "10px",
  border: "1px solid #2ecc71",
  background: "transparent",
  borderRadius: "8px",
  cursor: "pointer"
}

const mobilePrimaryBtn = {
  padding: "10px",
  background: "#2ecc71",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
}

export default Navbar