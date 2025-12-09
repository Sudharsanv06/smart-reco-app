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
    <div className="dashboard">
      <h1>Welcome, {user?.name || "Student"} 👋</h1>
      <p>Here's a quick overview of your learning activity and resources.</p>

      <section>
        <h2>Your activity</h2>

        {analytics ? (
          <div className="dash-cards">
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
        <section>
          <h3>Your top topics</h3>
          <div className="top-tags">
            {analytics.topTags.map((item) => (
              <span key={item.tag} className="tag-chip">
                {item.tag} • <span className="count">{item.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Recently added resources</h2>

        {loading && <div className="loading">Loading...</div>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && recentResources.length === 0 && (
          <p>No resources available yet.</p>
        )}

        <div className="resource-grid">
          {recentResources.map((r) => (
            <ResourceCard key={r._id || r.id} resource={r} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
