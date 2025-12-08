import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        background: "#020617",
        color: "#e5e7eb",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h2>SmartReco</h2>
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: "0.9rem" }}>
              {user?.name ? `Hi, ${user.name}` : "Logged in"}
            </span>
            <Link
              to="/dashboard"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                border: "none",
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                cursor: "pointer",
                background: "#4f46e5",
                color: "white",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
