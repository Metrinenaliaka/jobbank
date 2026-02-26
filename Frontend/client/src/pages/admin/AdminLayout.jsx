import { Link, Outlet, useLocation } from "react-router-dom"

function AdminLayout() {

  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div style={wrapper}>

      <aside style={sidebar}>
        <h2 style={{ marginTop: 0 }}>Simizi Admin</h2>

        <Link style={isActive("/admin/jobs") ? activeLink : link} to="/admin/jobs">
          Jobs
        </Link>

        <Link style={isActive("/admin/applications") ? activeLink : link} to="/admin/applications">
          Applications
        </Link>

        <Link style={isActive("/admin/support") ? activeLink : link} to="/admin/support">
          Support
        </Link>
      </aside>

      <main style={content}>
        <Outlet />
      </main>

    </div>
  )
}

const wrapper = {
  display: "flex",
  minHeight: "100vh",
  background: "#f9fafb"
}

const sidebar = {
  width: "240px",
  background: "#111827",
  color: "white",
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "15px"
}

const link = {
  color: "#9ca3af",
  textDecoration: "none",
  fontWeight: "600"
}

const activeLink = {
  ...link,
  color: "white"
}

const content = {
  flex: 1,
  padding: "40px"
}

export default AdminLayout