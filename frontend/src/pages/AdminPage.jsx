import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createResource } from "../api/resourceApi"

function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "video",
    url: "",
    tags: "",
    difficulty: "beginner",
    rating: 3,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

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
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const resourceData = {
        ...formData,
        tags: tagsArray,
        rating: Number(formData.rating),
      }

      await createResource(resourceData)
      setSuccess("Resource added successfully!")
      
      // Reset form
      setFormData({
        title: "",
        type: "video",
        url: "",
        tags: "",
        difficulty: "beginner",
        rating: 3,
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message || "Failed to add resource. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Add New Resource</h2>
        <p className="subtitle">Add study materials to the platform</p>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div style={{
            padding: "var(--spacing-sm) var(--spacing-md)",
            marginBottom: "var(--spacing-md)",
            fontSize: "0.875rem",
            color: "var(--success)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Introduction to Machine Learning"
            />
          </div>

          <div className="input-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="tutorial">Tutorial</option>
              <option value="course">Course</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="url">URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://example.com/resource"
            />
          </div>

          <div className="input-group">
            <label htmlFor="tags">Tags (comma-separated) *</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              required
              placeholder="e.g., ML, Python, AI, Tutorial"
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Resource"}
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

export default AdminPage
