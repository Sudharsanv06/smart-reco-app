import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile } from "../api/userApi"
import { useAuth } from "../context/AuthContext"

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    year: "",
    interests: "",
  })
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile()
        const user = data.user
        setFormData({
          name: user.name || "",
          email: user.email || "",
          branch: user.branch || "",
          year: user.year || "",
          interests: user.interests ? user.interests.join(", ") : "",
        })
      } catch (err) {
        console.error(err)
        setError("Failed to load profile")
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Convert interests string to array
      const interestsArray = formData.interests
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest.length > 0)

      const profileData = {
        name: formData.name,
        branch: formData.branch,
        year: Number(formData.year),
        interests: interestsArray,
      }

      const data = await updateProfile(profileData)
      setSuccess("Profile updated successfully!")

      // Update auth context with new user data
      const token = localStorage.getItem("token")
      if (token && data.user) {
        login(data.user, token)
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="dashboard">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Edit Profile</h2>
        <p className="subtitle">Update your learning preferences</p>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              marginBottom: "var(--spacing-md)",
              fontSize: "0.875rem",
              color: "var(--success)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "var(--radius-md)",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email (read-only)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="branch">Branch</label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g., AIML, CSE"
              />
            </div>

            <div className="input-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="interests">Interests (comma-separated)</label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., ML, Web Dev, DSA, Python"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Want to go back? <a href="/dashboard">Return to Dashboard</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
