import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchRecommendations } from "../api/resourceApi"
import ResourceCard from "../components/ResourceCard"
import EmptyState from "../components/EmptyState"
import ErrorState from "../components/ErrorState"

function RecommendationsPage() {
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadRecommendations = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await fetchRecommendations()
      const recs = data.resources || data
      setResources(recs)
    } catch (err) {
      console.error(err)
      // Detect ML service unavailability
      const isMlServiceError =
        err.message?.includes("ECONNREFUSED") ||
        err.message?.includes("Network Error") ||
        err.message?.includes("503")

      setError(
        isMlServiceError
          ? "The recommendation service is currently unavailable. Please ensure the ML service is running on port 8000."
          : err.message ||
              "Could not load recommendations. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [])

  return (
    <div className="dashboard">
      <h1>Your recommendations</h1>
      <p>
        Personalized resources based on your interests and learning activity.
      </p>

      {loading && <div className="loading">Loading recommendations...</div>}

      {error && (
        <ErrorState
          title="Failed to load recommendations"
          message={error}
          icon="🤖"
          onRetry={loadRecommendations}
        />
      )}

      {!loading && !error && resources.length === 0 && (
        <EmptyState
          icon="🎯"
          title="No recommendations yet"
          message="Start interacting with resources to get personalized recommendations! View, save, and like content to train the recommendation engine."
          actionText="Browse All Resources"
          onAction={() => navigate("/resources")}
        />
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="resource-grid">
          {resources.map((r) => (
            <ResourceCard key={r._id || r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RecommendationsPage
