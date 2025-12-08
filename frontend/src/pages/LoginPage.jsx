import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      login(data.user, data.token)
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your details."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p style={{ color: "salmon", fontSize: "0.85rem" }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
