import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { fetchResources } from "../api/resourceApi"
import { fetchUserAnalytics } from "../api/analyticsApi"
import ResourceCard from "../components/ResourceCard"
import EmptyState from "../components/EmptyState"
import ErrorState from "../components/ErrorState"

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recentResources, setRecentResources] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      setError(
        err.message || "Could not load dashboard data. Please check your connection."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || "Student"} 👋</h1>
      <p>Here's a quick overview of your learning activity and resources.</p>

      {loading && <div className="loading">Loading dashboard...</div>}

      {error && (
        <ErrorState
          title="Failed to load dashboard"
          message={error}
          onRetry={loadData}
        />
      )}

      {!loading && !error && (
        <>
          <section>
            <h2>Your activity</h2>

            {analytics && analytics.totalInteractions > 0 ? (
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
              <EmptyState
                icon="📊"
                title="No activity yet"
                message="Start exploring resources to build your learning journey! View, save, and like content to see your personalized analytics here."
                actionText="Explore Resources"
                onAction={() => navigate("/resources")}
              />
            )}
          </section>

          {analytics &&
            analytics.topTags &&
            analytics.topTags.length > 0 && (
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

            {recentResources.length === 0 ? (
              <EmptyState
                icon="📚"
                title="No resources available"
                message="Be the first to add learning resources to the platform! Share valuable content with the community."
                actionText="Add a Resource"
                onAction={() => navigate("/admin")}
              />
            ) : (
              <div className="resource-grid">
                {recentResources.map((r) => (
                  <ResourceCard key={r._id || r.id} resource={r} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default DashboardPage
