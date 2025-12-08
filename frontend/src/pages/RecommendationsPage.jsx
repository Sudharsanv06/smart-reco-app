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
    <div style={{ padding: "2rem", color: "#e5e7eb" }}>
      <h1>Your recommendations</h1>
      <p style={{ opacity: 0.8 }}>
        These will be personalized once the recommendation engine is connected.
      </p>

      {loading && <p>Loading recommendations...</p>}
      {error && (
        <p style={{ color: "salmon", fontSize: "0.85rem" }}>{error}</p>
      )}

      {!loading && !error && resources.length === 0 && (
        <p>No recommendations available yet.</p>
      )}

      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {resources.map((r) => (
          <ResourceCard key={r._id || r.id} resource={r} />
        ))}
      </div>
    </div>
  )
}

export default RecommendationsPage
