import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { fetchResources } from "../api/resourceApi"
import ResourceCard from "../components/ResourceCard"

function DashboardPage() {
  const { user } = useAuth()
  const [recentResources, setRecentResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchResources({ limit: 3 })
        const resources = data.resources || data
        setRecentResources(resources)
      } catch (err) {
        console.error(err)
        setError("Could not load dashboard data yet.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div style={{ padding: "2rem", color: "#e5e7eb" }}>
      <h1>Welcome, {user?.name || "Student"} 18b</h1>
      <p style={{ opacity: 0.8 }}>
        This is your dashboard. Soon you92ll see your learning stats and
        personalized recommendations here.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Quick stats (coming soon)</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div className="dash-card">Resources viewed: (later)</div>
          <div className="dash-card">Resources saved: (later)</div>
          <div className="dash-card">Top skill focus: (later)</div>
        </div>
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Recently added resources</h2>

        {loading && <p>Loading resources...</p>}
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
