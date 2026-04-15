import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import MobileMenu from "./MobileMenu"
import WhatsAppBar from "./WhatsAppBar"
import API from "../api"
import UpgradeModal from "./UpgradeModal"

import {
  X,
  Menu,
  Home,
  Briefcase,
  FileText,
  Folder,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Phone,
  MessageCircle,
  Wallet,
  Receipt,
  Sparkles
} from "lucide-react"

function Navbar({ onLoginClick, onSignupClick }) {

  const { user, logout } = useContext(AuthContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const [settings, setSettings] = useState(null)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  useEffect(() => {
  const handleClickOutside = (e) => {
    const menu = document.getElementById("desktop-menu-wrapper")

    if (menu && !menu.contains(e.target)) {
      setDesktopMenuOpen(false)
    }
  }

  if (desktopMenuOpen) {
    window.addEventListener("click", handleClickOutside)
  }

  return () => window.removeEventListener("click", handleClickOutside)
}, [desktopMenuOpen])
  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await API.get("site-settings/")
      setSettings(res.data)
    } catch (err) {
      console.error("Failed to load site settings")
    }
  }

  fetchSettings()
}, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const logoSize = isMobile ? "36px" : "72px"
 


  return (
    <>
    
    <nav style={navStyle}>
      <WhatsAppBar hidden={menuOpen} />
      
      <div style={wrapper(isMobile)}>
        

  {/* LOGO */}
  <Link to="/" style={logoStyle}>
    <h1 style={{ ...logoText, fontSize: logoSize }}>simizi</h1>
  </Link>

  {isMobile && (
  <div
    style={desktopHamburger}
    onClick={toggleMenu}
  >
    <Menu size={22} />
  </div>
)}

  {/* ✅ DESKTOP NAV LINKS BACK */}
  <div id="desktop-menu-wrapper">

  {!isMobile && (
    <div style={desktopMenu}>
      <NavLinks
        user={user}
        logout={logout}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        toggleDesktopMenu={() => setDesktopMenuOpen(prev => !prev)}
      />
    </div>
  )}

  {!isMobile && desktopMenuOpen && (
    <DesktopMenuDropdown
      user={user}
      logout={logout}
      closeMenu={() => setDesktopMenuOpen(false)}
      whatsappLink={settings?.whatsapp_link}
      openUpgrade={() => {
    setDesktopMenuOpen(false)   // close dropdown
    setShowUpgrade(true)        // open modal
  }}
    />
  )}

</div>

</div>
{showUpgrade && (
  <UpgradeModal
    user={user}
    onClose={() => setShowUpgrade(false)}
  />
)}

      {/* MOBILE DROPDOWN */}
      {isMobile && menuOpen && (
  <MobileMenu
    user={user}
    logout={logout}
    onLoginClick={onLoginClick}
    onSignupClick={onSignupClick}
    closeMenu={() => setMenuOpen(false)}
    
      whatsappLink={settings?.whatsapp_link}

  />
)}
    </nav>
    </>
  )
  
}


/* ===========================
   Reusable Nav Links
=========================== */

function NavLinks({ user, logout, onLoginClick, onSignupClick, mobile, closeMenu, toggleDesktopMenu}) {

  const handleClick = () => {
    if (mobile && closeMenu) closeMenu()
  }

  return (
    <>
      <Link to="/jobs" style={mobile ? mobileLink : desktopLink} onClick={handleClick}
      onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-2px)"
  e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.2)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.05)"
}}>
        Jobs
      </Link>

      <Link to="/resources" style={mobile ? mobileLink : desktopLink} onClick={handleClick}
      onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-2px)"
  e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.2)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.05)"
}}>
        Resources
      </Link>

      {user && !user.is_staff && (
        <Link to="/applications" style={mobile ? mobileLink : desktopLink} onClick={handleClick}
        onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-2px)"
  e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.2)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.05)"
}}>
          Application History
        </Link>
      )}

      {user?.is_staff && (
        <Link to="/admin/jobs" style={mobile ? adminLinkMobile : adminLink} onClick={handleClick}
        onMouseEnter={e => {
  e.currentTarget.style.transform = "translateY(-2px)"
  e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.2)"
}}
onMouseLeave={e => {
  e.currentTarget.style.transform = "translateY(0)"
  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.05)"
}}>
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
          {!mobile && (
  <>
    

    {/* ✅ NEW HAMBURGER */}
    <div
      style={desktopHamburger}
      onClick={toggleDesktopMenu} 
    >
      <Menu size={20} />
    </div>
  </>
)}

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
function DesktopMenuDropdown({ user, logout, closeMenu, whatsappLink, openUpgrade }) {
  //  const [showUpgrade, setShowUpgrade] = useState(false)
  return (
    <div style={desktopDropdown}>
      <div style={{ fontWeight: "600" }}>
              {user?.full_name || "Guest"}
            </div>
            <div style={{ fontSize: "13px", opacity: 0.6 }}>
              {user?.email || ""}
            </div>

      {/* TOOLS */}
      <Section title="TOOLS">
        <Item to="/documents" label="Documents" onClick={closeMenu} />
         <Item
  href="https://www.resume-now.com/lp/rnarsmsm63.aspx?utm_source=google&utm_medium=sem&utm_campaign=174127281&utm_term=free%20resume%20now&network=g&device=m&adposition=&adgroupid=14195414721&placement=&adid=528517245102&gad_source=1&gad_campaignid=174127281&gbraid=0AAAAADEP8E5v4VBQmXoZkyhjMA1NUOEYb&gclid=Cj0KCQjws83OBhD4ARIsACblj1_5N2ZpvCD0TQ6eA8WmY7egk1EROTV7U77J-YudjrrUAii7dxR3ur0aAgtbEALw_wcB"
  icon={<Sparkles size={18} color="#16a34a" />}
  label="Resume Builder"
  badge="AI"
/>
        <Item
  href="https://www.myperfectcoverletter.com/build-letter/mobile/creation-mode?utm_source=google&utm_medium=sem&utm_campaign=20498128053&utm_term=free+cover+letter+builder&network=g&device=t&adposition=&adgroupid=152552284709&placement=&adid=671950953986&gad_source=1&gad_campaignid=20498128053&gbraid=0AAAAADnFgEdTP2Rt_cqhJ4a3SS-eEBrrN&gclid=CjwKCAjwnN3OBhA8EiwAfpTYenTSPlnyoGQYhi0MpgvXnkWzXKPDpBs1cM5jNlJsiBIsYw912yx7CxoCxzAQAvD_BwE"
  icon={<Sparkles size={18} color="#16a34a" />}
  label="Cover Letter Builder"
  badge="AI"
  onClick={closeMenu}
/>
      </Section>

      {/* SUPPORT */}
      <Section title="SUPPORT">
        <Item
        href={whatsappLink}
  icon={<HelpCircle size={18} color="#16a34a" />}
  label="Help Center"
 
/>
        <Item
  href={whatsappLink}
  icon={<MessageCircle size={18} color="#16a34a" />}
  label="Chat on WhatsApp"
/>
        <Item
 href={`tel:${import.meta.env.VITE_SUPPORT_PHONE}`}
  icon={<Phone size={18} color="#16a34a" />}
  label="Call Support"
/>
      </Section>

      {/* ACCOUNT */}
      <Section title="ACCOUNT">
         <Item
          to="/profile"
          icon={<User size={18} color="#16a34a"/>}
          label="Profile"
          onClick={closeMenu}
        />
                <Item 
                to="/settings"
                icon={<Settings size={18} color="#16a34a"/>} 
                label="Settings"
                 onClick={closeMenu}/>
      </Section>

      {/* UPGRADE */}
      <div style={upgradeCard}  onClick={openUpgrade}>
        <div>
          <strong>Upgrade to Premium</strong>
          <p style={{ fontSize: "12px", opacity: 0.7 }}>
            Get unlimited AI tools & faster applications.
          </p>
        </div>
      </div>
      {/* {showUpgrade && (
  <UpgradeModal
    user={user}
    onClose={() => setShowUpgrade(false)}
  />
)} */}

      {/* LOGOUT */}
      <div style={logoutItem} onClick={logout}>
        Logout
      </div>

    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={section}>
      <p style={sectionTitle}>{title}</p>
      {children}
    </div>
  )
}
function Item({ to, href, icon, label, badge, onClick }) {
  const content = (
    <div style={item}>
      <div style={left}>
        {icon}
        {label}
        {badge && <span style={badgeStyle}>{badge}</span>}
      </div>
      <span style={arrow}>›</span>
    </div>
  )

  // 🔥 External link
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  // 🔥 Internal link
  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none" }} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return content
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
const badgeStyle = {
  background: "rgba(34,197,94,0.15)",
color: "#16a34a",
fontWeight: "600",
  fontSize: "10px",
  padding: "2px 6px",
  borderRadius: "8px",
  marginLeft: "6px"
}

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
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(10px)",

  padding: "10px 18px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#111",
  fontWeight: "500",
  fontSize: "14px",

  border: "1px solid rgba(255,255,255,0.4)",

  boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  transition: "all 0.25s ease"
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
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  padding: "10px 18px",
  borderRadius: "12px",
  border: "none",
  fontSize: "14px",
  fontWeight: "600",
  color: "white",
  cursor: "pointer",

  boxShadow: `
    0 10px 25px rgba(34,197,94,0.35),
    0 0 30px rgba(34,197,94,0.25),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,

  transition: "all 0.25s ease"
}
const desktopUser = {
  padding: "10px 22px",
  borderRadius: "12px",
  background: "#e5e5e5",
  fontWeight: "500"
}

/* MOBILE */


const item = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderRadius: "12px",
  cursor: "pointer",

  transition: "all 0.2s ease"
}
const left = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#111"
}

const arrow = {
  color: "#9ca3af",
fontSize: "16px"
}

const mobileDropdown = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "85%",
  height: "100vh",

  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(20px)",

  padding: "20px",
  zIndex: 2000,

  display: "flex",
  flexDirection: "column",
  gap: "18px",

  boxShadow: "-10px 0 40px rgba(0,0,0,0.2)"
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
const mobileHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
}
const userBlock = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
}

const avatar = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "rgba(34,197,94,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#22c55e"
}
const menuItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px",
  borderRadius: "10px",
  textDecoration: "none",
  color: "#111",
  fontWeight: "500"
}
const sectionTitle = {
  fontSize: "12px",
  fontWeight: "600",
  opacity: 0.5,
  marginTop: "10px"
}

const menuSection = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
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
const quickMenu = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
}

const quickItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "36px",
  height: "36px",

  borderRadius: "10px",

  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(10px)",

  border: "1px solid rgba(255,255,255,0.4)",

  cursor: "pointer",
  textDecoration: "none",
  color: "#111",

  transition: "all 0.2s ease"
}
const desktopHamburger = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "36px",
  height: "36px",

  borderRadius: "10px",
  cursor: "pointer",

  background: "rgba(255,255,255,0.6)",
  border: "1px solid rgba(255,255,255,0.4)"
}

const desktopDropdown = {
  position: "absolute",
  top: "80px",
  right: "40px",

  width: "300px",
  maxHeight: "80vh",          // ✅ LIMIT HEIGHT

  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(20px)",

  borderRadius: "16px",
  padding: "16px",

  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  zIndex: 2000,

  display: "flex",
  flexDirection: "column",
  gap: "12px",

  overflowY: "auto"           // ✅ ENABLE SCROLL
}

const upgradeMini = {
  background: "rgba(34,197,94,0.15)",
  padding: "10px",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "600",
  cursor: "pointer"
}

const logoutItem = {
  padding: "10px",
  color: "#ef4444",
  cursor: "pointer"
}
const section = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
}
const upgradeCard = {
  marginTop: "auto",
  background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.15))",
border: "1px solid rgba(34,197,94,0.3)",

boxShadow: "0 10px 30px rgba(34,197,94,0.15)",
  padding: "14px",
  borderRadius: "12px"
}


export default Navbar