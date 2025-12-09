import { useState } from "react"
import { addInteraction } from "../api/interactionApi"

/**
 * ResourceCard Component
 * 
 * Displays individual resource with metadata and interaction buttons
 * Tracks user interactions (view, save) and handles API errors gracefully
 * 
 * @param {Object} resource - Resource object with title, type, url, tags, difficulty
 */
function ResourceCard({ resource }) {
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const hasValidUrl =
    typeof resource.url === "string" && resource.url.trim().startsWith("http")

  const handleView = async () => {
    if (!hasValidUrl) return
    try {
      // Track view interaction
      await addInteraction(resource._id, "view")
    } catch (err) {
      console.error("View interaction failed:", err)
      // Continue opening link even if tracking fails
    } finally {
      window.open(resource.url, "_blank")
    }
  }

  const handleSave = async () => {
    setSaveError(false)
    try {
      await addInteraction(resource._id, "save")
      setSaved(true)
    } catch (err) {
      console.error("Save interaction failed:", err)
      setSaveError(true)
      // Reset error state after 3 seconds
      setTimeout(() => setSaveError(false), 3000)
    }
  }

  return (
    <div className="resource-card">
      <h3>{resource.title}</h3>
      
      <div className="resource-card-meta">
        <span className="resource-card-type">{resource.type?.toUpperCase()}</span>
        <span className="separator">•</span>
        <span className={`resource-card-difficulty ${resource.difficulty?.toLowerCase()}`}>
          {resource.difficulty || "N/A"}
        </span>
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="resource-card-tags">
          {resource.tags.map((tag) => (
            <span key={tag} className="resource-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="resource-card-actions">
        <button onClick={handleView} disabled={!hasValidUrl}>
          {hasValidUrl ? "Open" : "No link"}
        </button>
        <button 
          onClick={handleSave} 
          disabled={saved} 
          className={saved ? "saved" : saveError ? "error" : ""}
          title={saveError ? "Failed to save. Click to retry." : ""}
        >
          {saved ? "Saved ✅" : saveError ? "Retry 🔄" : "Save"}
        </button>
      </div>
    </div>
  )
}

export default ResourceCard
