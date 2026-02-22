import { Link } from "react-router-dom"
import { useContext } from "react"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"

function Navbar({ onLoginClick, onSignupClick }) {

  const { user, logout } = useContext(AuthContext)

  return (
    <nav style={navStyle}>
      <div className="container" style={containerStyle}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h2 style={{ margin: 0 }}>Simizi</h2>
        </Link>

        {/* Menu */}
        <div style={menuStyle}>

          {/* Always visible */}
          <Link to="/jobs" style={linkStyle}>Jobs</Link>

          {/* NORMAL USERS ONLY */}
          {user && !user.is_staff && (
            <Link to="/applications" style={linkStyle}>
              Application History
            </Link>
          )}

          {/* ADMIN ONLY */}
          {user?.is_staff && (
            <Link to="/admin/jobs" style={adminLinkStyle}>
              Admin Panel
            </Link>
          )}

          {/* Auth Section */}
          {!user ? (
            <>
              <button style={loginBtn} onClick={onLoginClick}>
                Log In
              </button>

              <button style={signupBtn} onClick={onSignupClick}>
                Sign Up
              </button>
            </>
          ) : (
            <div style={userSection}>
              <span style={userName}>
                👤 {user.full_name}
              </span>

              <button style={signupBtn} onClick={logout}>
                Sign Out
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}

/* ===== Styles ===== */

const navStyle = {
  background: "#2ecc71",
  padding: "15px 0",
  color: "white"
}

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

const menuStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500"
}

const adminLinkStyle = {
  color: "#fff",
  background: "#27ae60",
  padding: "6px 12px",
  borderRadius: "5px",
  textDecoration: "none",
  fontWeight: "600"
}

const userSection = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
}

const userName = {
  fontWeight: "600",
  color: "white"
}

const loginBtn = {
  padding: "8px 16px",
  border: "1px solid white",
  background: "transparent",
  color: "white",
  borderRadius: "4px",
  cursor: "pointer"
}

const signupBtn = {
  padding: "8px 16px",
  border: "none",
  background: "white",
  color: "#2ecc71",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600"
}

export default Navbar