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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          SmartReco
        </Link>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="navbar-user">
                <span className="navbar-user-name">
                  {user?.name ? `Hi, ${user.name}` : "Logged in"}
                </span>
              </div>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/recommendations" className="navbar-link">
                Recommendations
              </Link>
              <Link to="/admin" className="navbar-link">
                Add Resource
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
