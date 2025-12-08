import { Link } from "react-router-dom"

function Navbar() {
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

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/login" style={{ color: "#e5e7eb", textDecoration: "none" }}>
          Login
        </Link>
        <Link
          to="/register"
          style={{ color: "#e5e7eb", textDecoration: "none" }}
        >
          Register
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
