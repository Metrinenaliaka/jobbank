import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function Navbar({ onLoginClick, onSignupClick }) {

  const { user, logout } = useContext(AuthContext)

  return (
    <nav style={navStyle}>
      <div className="container" style={containerStyle}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h2 style={{ margin: 0 }}>JobBank</h2>
        </Link>

        {/* Menu */}
        <div style={menuStyle}>

          <Link to="/jobs" style={linkStyle}>Jobs</Link>
          <Link to="/resources" style={linkStyle}>Resources</Link>
          <Link to="/tools" style={linkStyle}>Tools</Link>

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
            <button style={signupBtn} onClick={logout}>
              Sign Out
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}

/* Styles */

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
