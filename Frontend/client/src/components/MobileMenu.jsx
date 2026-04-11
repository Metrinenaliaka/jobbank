import { Link } from "react-router-dom"
import { useState } from "react"
import UpgradeModal from "./UpgradeModal"
import.meta.env.VITE_SUPPORT_PHONE 
import {
  X,
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



function MobileMenu({
  user,
  logout,
  onLoginClick,
  onSignupClick,
  closeMenu,  whatsappLink
}) {
  const handleClick = () => {
    if (closeMenu) closeMenu()
  }
const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <div style={userBlock}>
          <div style={avatar}>
            <User size={20} />
          </div>

          <div>
            <div style={{ fontWeight: "600" }}>
              {user?.full_name || "Guest"}
            </div>
            <div style={{ fontSize: "13px", opacity: 0.6 }}>
              {user?.email || ""}
            </div>
          </div>
        </div>

        <X size={22} onClick={closeMenu} style={{ cursor: "pointer" }} />
      </div>

      {/* MAIN */}
      <Section title="MAIN">
        <Item to="/" icon={<Home size={18} color="#16a34a"/>} label="Home" onClick={handleClick} />
        <Item to="/jobs" icon={<Briefcase size={18} color="#16a34a"/>} label="Job Board" onClick={handleClick} />
        {!user?.is_staff && (
  <Item
    to="/applications"
    icon={<FileText size={18} color="#16a34a"/>}
    label="My Applications"
    onClick={handleClick}
  />
)}
        <Item to="/documents" icon={<Folder size={18} color="#16a34a"/>} label="Documents" onClick={handleClick} />
        {user?.is_staff && (
  <Item
    to="/admin/jobs"
    icon={<Briefcase size={18} color="#16a34a"/>}
    label="Admin Panel"
    onClick={handleClick}
  />
)}
      </Section>

      {/* TOOLS */}
      <Section title="TOOLS & SERVICES">
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
  onClick={handleClick}
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
  onClick={handleClick}
/>
        <Item 
        to="/settings"
        icon={<Settings size={18} color="#16a34a"/>} 
        label="Settings"
         onClick={handleClick} />
       

        {user ? (
          <div
            style={{ ...item, color: "#ef4444" }}
            onClick={() => {
              logout()
              handleClick()
            }}
          >
            <div style={left}>
              <LogOut size={18} color="#ef4444" />
              Logout
            </div>
          </div>
        ) : (
          <>
            <button
              style={btn}
              onClick={() => {
                onLoginClick()
                handleClick()
              }}
            >
              Log In
            </button>

            <button
              style={primaryBtn}
              onClick={() => {
                onSignupClick()
                handleClick()
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </Section>

      {/* UPGRADE CARD */}
      <div style={upgradeCard}  onClick={() => setShowUpgrade(true)}>
        <div>
          <strong>Upgrade to Premium</strong>
          <p style={{ fontSize: "12px", opacity: 0.7 }}>
            Get unlimited AI tools & faster applications.
          </p>
        </div>
      </div>
      {showUpgrade && (
  <UpgradeModal
    user={user}
    onClose={() => setShowUpgrade(false)}
  />
)}

    </div>
  )
}


/* ================= COMPONENTS ================= */

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

/* ================= STYLES ================= */

const container = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "85%",
  height: "100vh",
  
  padding: "24px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  zIndex: 2000,
  overflowY: "auto",
  background: "rgba(255,255,255,0.75)",
backdropFilter: "blur(30px)",
WebkitBackdropFilter: "blur(30px)",

borderLeft: "1px solid rgba(255,255,255,0.4)",

boxShadow: `
  -20px 0 60px rgba(0,0,0,0.25),
  inset 1px 0 0 rgba(255,255,255,0.6)
`
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
paddingBottom: "12px"
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

const section = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
}

const sectionTitle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
letterSpacing: "0.08em",
marginTop: "10px"
}

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

const badgeStyle = {
  background: "rgba(34,197,94,0.15)",
color: "#16a34a",
fontWeight: "600",
  fontSize: "10px",
  padding: "2px 6px",
  borderRadius: "8px",
  marginLeft: "6px"
}

const btn = {
  padding: "10px",
  border: "1px solid #22c55e",
  borderRadius: "8px",
  background: "transparent",
  cursor: "pointer"
}

const primaryBtn = {
  padding: "10px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
}

const upgradeCard = {
  marginTop: "auto",
  background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.15))",
border: "1px solid rgba(34,197,94,0.3)",

boxShadow: "0 10px 30px rgba(34,197,94,0.15)",
  padding: "14px",
  borderRadius: "12px"
}

export default MobileMenu