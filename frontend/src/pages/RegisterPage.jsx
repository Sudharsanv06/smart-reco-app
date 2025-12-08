import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser, loginUser } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await registerUser(form)
      const data = await loginUser({
        email: form.email,
        password: form.password,
      })
      login(data.user, data.token)
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Create an account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Branch
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="AIML / CSE / ECE..."
          />
        </label>

        <label>
          Year
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2 / 3 / 4"
          />
        </label>

        {error && (
          <p style={{ color: "salmon", fontSize: "0.85rem" }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
