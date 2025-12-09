import { useEffect, useState } from "react"
import { fetchRecommendations } from "../api/resourceApi"
import ResourceCard from "../components/ResourceCard"

function RecommendationsPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchRecommendations()
        const recs = data.resources || data
        setResources(recs)
      } catch (err) {
        console.error(err)
        setError(
          "Could not load recommendations yet. Backend will provide them later."
        )
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  return (
    <div className="dashboard">
      <h1>Your recommendations</h1>
      <p>These will be personalized once the recommendation engine is connected.</p>

      {loading && <div className="loading">Loading recommendations...</div>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && resources.length === 0 && (
        <p>No recommendations available yet.</p>
      )}

      <div className="resource-grid">
        {resources.map((r) => (
          <ResourceCard key={r._id || r.id} resource={r} />
        ))}
      </div>
    </div>
  )
}

export default RecommendationsPage
