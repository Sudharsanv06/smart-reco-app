import { useEffect, useState } from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { fetchResources } from "../api/resourceApi"
import { fetchUserAnalytics } from "../api/analyticsApi"
import ResourceCard from "../components/ResourceCard"

function DashboardPage() {
  const { user } = useAuth()
  const [recentResources, setRecentResources] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError("")
      try {
        const [resourcesData, analyticsData] = await Promise.all([
          fetchResources({ limit: 3 }),
          fetchUserAnalytics(),
        ])

        const resources = resourcesData.resources || resourcesData
        setRecentResources(resources)
        setAnalytics(analyticsData)
      } catch (err) {
        console.error(err)
        setError("Could not load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div style={{ padding: "2rem", color: "#e5e7eb" }}>
      <h1>Welcome, {user?.name || "Student"} 👋</h1>
      <p style={{ opacity: 0.8 }}>
        Here’s a quick overview of your learning activity and resources.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Your activity</h2>

        {analytics ? (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div className="dash-card">
              <strong>Total interactions</strong>
              <div>{analytics.totalInteractions}</div>
            </div>
            <div className="dash-card">
              <strong>Views</strong>
              <div>{analytics.views}</div>
            </div>
            <div className="dash-card">
              <strong>Saved resources</strong>
              <div>{analytics.savedResourceCount}</div>
            </div>
            <div className="dash-card">
              <strong>Likes</strong>
              <div>{analytics.likes}</div>
            </div>
          </div>
        ) : (
          <p>No activity yet. Start exploring some resources!</p>
        )}
      </section>

      {analytics && analytics.topTags && analytics.topTags.length > 0 && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Your top topics</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {analytics.topTags.map((item) => (
              <span
                key={item.tag}
                style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid #1f2933",
                  background: "#020617",
                  fontSize: "0.85rem",
                }}
              >
                {item.tag} • {item.count}
              </span>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Recently added resources</h2>

        {loading && <p>Loading...</p>}
        {error && (
          <p style={{ color: "salmon", fontSize: "0.85rem" }}>{error}</p>
        )}

        {!loading && !error && recentResources.length === 0 && (
          <p>No resources available yet.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {recentResources.map((r) => (
            <ResourceCard key={r._id || r.id} resource={r} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
